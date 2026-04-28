import { Router } from "express";
import { authRoute } from "../module/auth/auth.route";
import { categoryRoute } from "../module/category/category.route";
import { manufacturerRoute } from "../module/manufacturer/manufacturer.route";
import { sellerRoute } from "../module/seller/seller.route";
import { medicineRoute } from "../module/medincine/medicine.route";
import { cartRoute } from "../module/cart/cart.route";
import { orderRoute } from "../module/order/order.route";
import { reviewRoute } from "../module/review/review.route";
import { adminRoute } from "../module/admin/admin.route";
import { statsRoute } from "../module/stats/stats.route";

const router = Router();

router.use("/auth", authRoute);
router.use("/category", categoryRoute);
router.use("/manufacturer", manufacturerRoute);
router.use("/seller", sellerRoute);
router.use("/medicine", medicineRoute);
router.use("/cart", cartRoute);
router.use("/order", orderRoute);
router.use("/review", reviewRoute);
router.use("/admin", adminRoute);
router.use("/stats", statsRoute);

export const indexRoutes = router;
