import { Router } from "express";
import { reviewController } from "./review.controller";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { reviewValidation } from "./review.validation";

const router = Router();

router.post(
  "/",
  checkAuth(Role.CUSTOMER),
  validateRequest(reviewValidation.createReviewSchema),
  reviewController.createReview,
);
router.get("/medicine/:medicineId", reviewController.getReviewsByMedicineId);
router.patch(
  "/:id",
  checkAuth(Role.CUSTOMER),
  validateRequest(reviewValidation.updateReviewSchema),
  reviewController.updateReview,
);
router.delete("/:id", checkAuth(Role.CUSTOMER), reviewController.deleteReview);

export const reviewRoute = router;
