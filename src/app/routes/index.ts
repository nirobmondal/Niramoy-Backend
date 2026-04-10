import { Router } from "express";
import { categoryRoute } from "../module/category/category.route";
import { manufacturerRoute } from "../module/manufacturer/manufacturer.route";
import { sellerRoute } from "../module/seller/seller.route";
import { medicineRoute } from "../module/medincine/medicine.route";

const router = Router();
router.use("/category", categoryRoute);
router.use("/manufacturer", manufacturerRoute);
router.use("/seller", sellerRoute);
router.use("/medicine", medicineRoute);

export const indexRoutes = router;
