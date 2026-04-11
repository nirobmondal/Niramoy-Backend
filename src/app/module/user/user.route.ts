import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { userController } from "./user.controller";

const router = Router();

router.get(
  "/profile",
  checkAuth(Role.ADMIN, Role.SELLER, Role.CUSTOMER),
  userController.getMe,
);
router.patch(
  "/profile",
  checkAuth(Role.ADMIN, Role.SELLER, Role.CUSTOMER),
  userController.updateMe,
);

export const userRoute = router;
