import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { adminService } from "./admin.service";
import status from "http-status";

const manageUserStatues = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const payload = req.body;

  const result = await adminService.manageUserStatues(
    req.user.userId,
    userId as string,
    payload,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

export const adminController = {
  manageUserStatues,
};
