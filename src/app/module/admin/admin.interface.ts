import { UserStatus } from "../../../generated/prisma/enums";

export interface IManageUserStatusPayload {
  status: UserStatus;
}

export interface IGetAllUsersQuery {
  searchTerm?: string;
  role?: string;
  status?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
