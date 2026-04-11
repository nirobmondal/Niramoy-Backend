import { Router } from "express";
import { orderController } from "./order.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", checkAuth(Role.CUSTOMER), orderController.placeOrder);
router.get("/", checkAuth(Role.ADMIN), orderController.getAllOrders);
router.get("/user", checkAuth(Role.CUSTOMER), orderController.getOrderByUserId);
router.get(
  "/seller",
  checkAuth(Role.SELLER),
  orderController.getOrderBySellerId,
);
router.get("/:id", checkAuth(Role.ADMIN), orderController.getOrderById);
router.get(
  "/seller-order/:id",
  checkAuth(Role.SELLER),
  orderController.getOrderBySellerOrderId,
);
router.patch(
  "/:id/cancel",
  checkAuth(Role.CUSTOMER),
  orderController.cancelOrder,
);
router.patch(
  "/:id/status",
  checkAuth(Role.SELLER),
  orderController.updateSellerOrderStatus,
);

export const orderRoute = router;
