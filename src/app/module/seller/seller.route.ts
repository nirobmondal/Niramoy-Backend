import { Router } from "express";
import { sellerController } from "./seller.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { sellerValidation } from "./seller.validation";

const router = Router();

router.post(
  "/create-profile",
  checkAuth(Role.CUSTOMER),
  validateRequest(sellerValidation.createSellerProfileSchema),
  sellerController.createSellerProfile,
);

export const sellerRoute = router;
