import status from "http-status";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateSellerProfilePayload } from "./seller.interface";

const createSellerProfile = async (
  userId: string,
  payload: ICreateSellerProfilePayload,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      sellerProfile: true,
    },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (user.status === UserStatus.BANNED) {
    throw new AppError(
      status.FORBIDDEN,
      "Banned users cannot create seller profile",
    );
  }

  if (user.sellerProfile) {
    throw new AppError(status.CONFLICT, "Seller profile already exists");
  }

  const result = await prisma.$transaction(async (tx) => {
    const sellerProfile = await tx.seller.create({
      data: {
        userId,
        shopName: payload.shopName,
        shopAddress: payload.shopAddress,
        shopPhone: payload.shopPhone,
      },
    });

    await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        role: Role.SELLER,
      },
    });

    return sellerProfile;
  });

  return result;
};

export const sellerService = {
  createSellerProfile,
};
