import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sellerService } from "./seller.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createSellerProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
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

export const sellerController = {
  createSellerProfile,
};
