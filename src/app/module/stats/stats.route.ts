import { Router } from "express";
import { statsController } from "./stats.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/dashboard",
  checkAuth(Role.CUSTOMER, Role.SELLER, Role.ADMIN),
  statsController.getDashboardStatsData,
);

export const statsRoute = router;
