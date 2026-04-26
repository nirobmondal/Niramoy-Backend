import { Router } from "express";
import { adminController } from "./admin.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { adminValidation } from "./admin.validation";

const router = Router();

router.get("/users", checkAuth(Role.ADMIN), adminController.getAllUsers);

router.patch(
  "/users/:userId/status",
  checkAuth(Role.ADMIN),
  validateRequest(adminValidation.manageUserStatusSchema),
  adminController.manageUserStatues,
);

export const adminRoute = router;
