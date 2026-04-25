import status from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../utils/email";
import { jwtUtils } from "../../utils/jwt";
import { tokenUtils } from "../../utils/token";
import {
  IAuthTokenPayload,
  IChangePasswordPayload,
  ILoginUserPayload,
  IRegisterCustomerPayload,
  IUpdateMePayload,
} from "./auth.interface";

interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  emailVerified: boolean;
}

interface IAuthSession {
  user: IAuthUser;
}

interface ISignInOrSignUpResult {
  user?: IAuthUser;
  token?: string;
  [key: string]: unknown;
}

const buildTokenPayload = (user: IAuthUser): IAuthTokenPayload => ({
  userId: user.id,
  role: user.role,
  name: user.name,
  email: user.email,
  status: user.status,
  emailVerified: user.emailVerified,
});

const getJwtPair = (user: IAuthUser) => {
  const payload = buildTokenPayload(user);

  return {
    accessToken: tokenUtils.getAccessToken(payload as unknown as JwtPayload),
    refreshToken: tokenUtils.getRefreshToken(payload as unknown as JwtPayload),
  };
};

const ensureUserIsActive = (user: IAuthUser) => {
  if ((user.status as UserStatus) === UserStatus.BANNED) {
    throw new AppError(status.FORBIDDEN, "Your account is blocked");
  }
};

const getUserProfileById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      sellerProfile: true,
    },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  return user;
};

const registerCustomer = async (payload: IRegisterCustomerPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new AppError(status.CONFLICT, "User already exists with this email");
  }

  const result = (await auth.api.signUpEmail({
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      image: payload.image,
      phone: payload.phone,
      role: Role.CUSTOMER,
      status: UserStatus.ACTIVE,
    },
  })) as ISignInOrSignUpResult;

  if (!result.user) {
    throw new AppError(status.BAD_REQUEST, "Failed to register customer");
  }

  await prisma.cart.upsert({
    where: { userId: result.user.id },
    update: {},
    create: { userId: result.user.id },
  });

  const { accessToken, refreshToken } = getJwtPair(result.user);

  return {
    ...result,
    accessToken,
    refreshToken,
  };
};

const loginUser = async (payload: ILoginUserPayload) => {
  const result = (await auth.api.signInEmail({
    body: {
      email: payload.email,
      password: payload.password,
    },
  })) as ISignInOrSignUpResult;

  if (!result.user) {
    throw new AppError(status.UNAUTHORIZED, "Invalid credentials");
  }

  ensureUserIsActive(result.user);

  const { accessToken, refreshToken } = getJwtPair(result.user);

  return {
    ...result,
    accessToken,
    refreshToken,
  };
};

const getMe = async (user: IRequestUser) => {
  return getUserProfileById(user.userId);
};

const updateMe = async (user: IRequestUser, updateData: IUpdateMePayload) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: user.userId },
    include: {
      sellerProfile: true,
    },
  });

  if (!existingUser) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (existingUser.status === UserStatus.BANNED) {
    throw new AppError(status.FORBIDDEN, "Your account is blocked");
  }

  if (updateData.sellerProfile && existingUser.role !== Role.SELLER) {
    throw new AppError(
      status.BAD_REQUEST,
      "Seller profile can only be updated by seller accounts",
    );
  }

  const userUpdateData = {
    name: updateData.name,
    phone: updateData.phone,
    image: updateData.image,
  };

  await prisma.$transaction(async (tx) => {
    if (
      userUpdateData.name !== undefined ||
      userUpdateData.phone !== undefined ||
      userUpdateData.image !== undefined
    ) {
      await tx.user.update({
        where: { id: user.userId },
        data: userUpdateData,
      });
    }

    if (updateData.sellerProfile && existingUser.role === Role.SELLER) {
      const hasSellerUpdate = Object.values(updateData.sellerProfile).some(
        (field) => field !== undefined,
      );

      if (hasSellerUpdate) {
        await tx.seller.upsert({
          where: { userId: user.userId },
          update: {
            shopName: updateData.sellerProfile.shopName,
            shopAddress: updateData.sellerProfile.shopAddress,
            shopPhone: updateData.sellerProfile.shopPhone,
          },
          create: {
            userId: user.userId,
            shopName:
              updateData.sellerProfile.shopName ||
              existingUser.sellerProfile?.shopName ||
              `${existingUser.name}'s Shop`,
            shopAddress: updateData.sellerProfile.shopAddress,
            shopPhone: updateData.sellerProfile.shopPhone,
          },
        });
      }
    }
  });

  return getUserProfileById(user.userId);
};

const getNewToken = async (refreshToken: string, sessionToken: string) => {
  if (!sessionToken) {
    throw new AppError(status.UNAUTHORIZED, "Session token is missing");
  }

  const currentSession = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    },
  });

  if (!currentSession || currentSession.expiresAt <= new Date()) {
    throw new AppError(status.UNAUTHORIZED, "Session is invalid or expired");
  }

  ensureUserIsActive(currentSession.user);

  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET,
  );

  if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
    throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
  }

  const tokenPayload = verifiedRefreshToken.data as JwtPayload;

  if (tokenPayload.userId !== currentSession.userId) {
    throw new AppError(
      status.UNAUTHORIZED,
      "Refresh token does not match session",
    );
  }

  const { accessToken, refreshToken: newRefreshToken } = getJwtPair(
    currentSession.user,
  );

  await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    sessionToken,
  };
};

const changePassword = async (
  payload: IChangePasswordPayload,
  sessionToken: string,
) => {
  if (!sessionToken) {
    throw new AppError(status.UNAUTHORIZED, "Session token is missing");
  }

  const session = (await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  })) as IAuthSession | null;

  if (!session || !session.user) {
    throw new AppError(status.UNAUTHORIZED, "Invalid session token");
  }

  ensureUserIsActive(session.user);

  const result = await auth.api.changePassword({
    body: {
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
      revokeOtherSessions: true,
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  const { accessToken, refreshToken } = getJwtPair(session.user);

  await sendEmail({
    to: session.user.email,
    subject: "Your password was changed",
    templateName: "passwordChanged",
    templateData: {
      name: session.user.name,
      supportEmail: envVars.EMAIL_SENDER.SMTP_FROM,
      changedAt: new Date().toLocaleString(),
    },
  });

  return {
    ...result,
    accessToken,
    refreshToken,
  };
};

const logoutUser = async (sessionToken: string) => {
  if (!sessionToken) {
    return { success: true };
  }

  return auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });
};

const verifyEmail = async (email: string, otp: string) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp,
    },
  });

  if ((result as { status?: boolean }).status) {
    const user = await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });

    await sendEmail({
      to: user.email,
      subject: "Welcome to Niramoy",
      templateName: "welcome",
      templateData: {
        name: user.name,
        loginUrl: `${envVars.FRONTEND_URL}/login`,
      },
    });
  }

  return result;
};

const forgetPassword = async (email: string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  ensureUserIsActive(existingUser);

  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email,
    },
  });
};

const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  ensureUserIsActive(existingUser);

  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword,
    },
  });

  await prisma.session.deleteMany({
    where: {
      userId: existingUser.id,
    },
  });
};

const googleLoginSuccess = async (session: IAuthSession) => {
  if (!session.user) {
    throw new AppError(status.UNAUTHORIZED, "No authenticated user found");
  }

  ensureUserIsActive(session.user);

  await prisma.cart.upsert({
    where: { userId: session.user.id },
    update: {},
    create: { userId: session.user.id },
  });

  const { accessToken, refreshToken } = getJwtPair(session.user);

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  registerCustomer,
  loginUser,
  getMe,
  updateMe,
  getNewToken,
  changePassword,
  logoutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  googleLoginSuccess,
};
