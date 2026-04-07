import { Router } from "express";
import { categoryRoute } from "../module/category/category.route";

const router = Router();
router.use("/category", categoryRoute);

export const indexRoutes = router;
