import { UserStatus } from "../../../generated/prisma/enums";

export interface IManageUserStatusPayload {
  status: UserStatus;
}
