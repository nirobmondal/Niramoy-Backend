import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { reviewService } from "./review.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createReview = catchAsync(async (req: Request, res: Response) => {});

const getReviewsByMedicineId = catchAsync(
  async (req: Request, res: Response) => {},
);

const updateReview = catchAsync(async (req: Request, res: Response) => {});

const deleteReview = catchAsync(async (req: Request, res: Response) => {});

export const reviewController = {
  createReview,
  getReviewsByMedicineId,
  updateReview,
  deleteReview,
};
