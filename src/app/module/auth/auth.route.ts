import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = Router();

router.post(
  "/register/customer",
  multerUpload.single("file"),
  validateRequest(AuthValidation.registerCustomerSchema),
  AuthController.registerCustomer,
);

router.post(
  "/login",
  validateRequest(AuthValidation.loginSchema),
  AuthController.loginUser,
);

router.get(
  "/me",
  checkAuth(Role.CUSTOMER, Role.SELLER, Role.ADMIN),
  AuthController.getMe,
);

router.patch(
  "/me",
  checkAuth(Role.CUSTOMER, Role.SELLER, Role.ADMIN),
  multerUpload.single("file"),
  validateRequest(AuthValidation.updateMeSchema),
  AuthController.updateMe,
);

router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenSchema),
  AuthController.getNewToken,
);

router.post(
  "/change-password",
  checkAuth(Role.CUSTOMER, Role.SELLER, Role.ADMIN),
  validateRequest(AuthValidation.changePasswordSchema),
  AuthController.changePassword,
);

router.post("/logout", AuthController.logoutUser);

router.post(
  "/verify-email",
  validateRequest(AuthValidation.verifyEmailSchema),
  AuthController.verifyEmail,
);

router.post(
  "/forgot-password",
  validateRequest(AuthValidation.forgotPasswordSchema),
  AuthController.forgetPassword,
);

router.post(
  "/reset-password",
  validateRequest(AuthValidation.resetPasswordSchema),
  AuthController.resetPassword,
);

router.get("/login/google", AuthController.googleLogin);
router.get("/google/success", AuthController.googleLoginSuccess);
router.get("/google/error", AuthController.handleOAuthError);

export const AuthRoute = router;
