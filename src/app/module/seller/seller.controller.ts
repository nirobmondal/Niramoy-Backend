import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sellerService } from "./seller.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createSellerProfile = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const payload = {
    userId,
    ...req.body,
  };

  const result = await sellerService.createSellerProfile(payload);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Seller profile created successfully",
    data: result,
  });
});

const updateSellerProfile = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const payload = req.body;

  const result = await sellerService.updateSellerProfile(
    userId as string,
    payload,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Seller profile updated successfully",
    data: result,
  });
});

const getSellerDashboard = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;

  const dashboardData = await sellerService.getSellerDashboard(userId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Seller dashboard data retrieved successfully",
    data: dashboardData,
  });
});

export const sellerController = {
  createSellerProfile,
  updateSellerProfile,
  getSellerDashboard,
};
