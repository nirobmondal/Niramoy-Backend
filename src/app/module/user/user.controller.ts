import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { userService } from "./user.service";
import status from "http-status";

const getMe = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;

  const user = await userService.getMe(userId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: user,
  });
});

const updateMe = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const payload = req.body;

  const updatedUser = await userService.updateMe(userId as string, payload);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User profile updated successfully",
    data: updatedUser,
  });
});

export const userController = {
  getMe,
  updateMe,
};
