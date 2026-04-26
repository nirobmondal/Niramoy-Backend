import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { statsService } from "./stats.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const getDashboardStatsData = catchAsync(
  async (req: Request, res: Response) => {
    const result = await statsService.getDashboardStatsData(
      req.user.userId,
      req.user.role,
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Dashboard stats fetched successfully",
      data: result,
    });
  },
);

export const statsController = {
  getDashboardStatsData,
};
