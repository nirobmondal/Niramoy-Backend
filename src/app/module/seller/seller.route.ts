import { Router } from "express";
import { sellerController } from "./seller.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/create-profile",
  checkAuth(Role.CUSTOMER),
  sellerController.createSellerProfile,
);

router.patch(
  "/update-profile",
  checkAuth(Role.SELLER),
  sellerController.updateSellerProfile,
);

router.get(
  "/dashboard",
  checkAuth(Role.SELLER),
  sellerController.getSellerDashboard,
);

export const sellerRoute = router;
