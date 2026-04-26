import z from "zod";
import { UserStatus } from "../../../generated/prisma/enums";

const manageUserStatusSchema = z.object({
  status: z.enum(UserStatus),
});

export const adminValidation = {
  manageUserStatusSchema,
};
