import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload, IUpdateReviewPayload } from "./review.interface";
import { OrderStatus, Role } from "../../../generated/prisma/enums";

const createReview = async () => {};

const getReviewsByMedicineId = async () => {};

const updateReview = async () => {};

const deleteReview = async () => {};

export const reviewService = {
  createReview,
  getReviewsByMedicineId,
  updateReview,
  deleteReview,
};
