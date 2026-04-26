import { Router } from "express";
import { reviewController } from "./review.controller";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

export const reviewRoute = router;
