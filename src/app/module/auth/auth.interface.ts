export interface ILoginUserPayload {
  email: string;
  password: string;
}

export interface IRegisterCustomerPayload {
  name: string;
  email: string;
  password: string;
  image?: string;
  phone?: string;
}

export interface IUpdateSellerProfilePayload {
  shopName?: string;
  shopAddress?: string;
  shopPhone?: string;
}

export interface IUpdateMePayload {
  name?: string;
  phone?: string;
  image?: string;
  sellerProfile?: IUpdateSellerProfilePayload;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface IVerifyEmailPayload {
  email: string;
  otp: string;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface IAuthTokenPayload {
  userId: string;
  role: string;
  name: string;
  email: string;
  status: string;
  emailVerified: boolean;
}
