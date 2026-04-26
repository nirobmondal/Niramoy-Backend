import { Router } from "express";
import { cartController } from "./cart.controller";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { cartValidation } from "./cart.validation";

const router = Router();

router.post(
  "/",
  checkAuth(Role.CUSTOMER),
  validateRequest(cartValidation.addToCartSchema),
  cartController.addToCart,
);
router.get("/", checkAuth(Role.CUSTOMER), cartController.getCartItems);
router.patch(
  "/",
  checkAuth(Role.CUSTOMER),
  validateRequest(cartValidation.updateCartItemSchema),
  cartController.updateCartItem,
);
router.delete(
  "/:medicineId",
  checkAuth(Role.CUSTOMER),
  cartController.deleteCartItem,
);
router.delete("/", checkAuth(Role.CUSTOMER), cartController.clearCart);

export const cartRoute = router;
