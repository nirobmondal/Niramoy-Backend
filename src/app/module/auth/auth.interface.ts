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

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
