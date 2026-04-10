import { Router } from "express";
import { sellerController } from "./seller.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/create-seller-profile",
  checkAuth(Role.CUSTOMER),
  sellerController.createSellerProfile,
);

export const sellerRoute = router;
