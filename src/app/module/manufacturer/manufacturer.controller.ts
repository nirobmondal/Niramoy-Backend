import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { manufacturerService } from "./manufacturer.service";
import { Request, Response } from "express";

const createManufacturer = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await manufacturerService.createManufacturer(payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Manufacturer created successfully",
    data: result,
  });
});

const getAllManufacturer = catchAsync(async (_req: Request, res: Response) => {
  const result = await manufacturerService.getAllManufacturer();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Manufacturers retrieved successfully",
    data: result,
  });
});

const updateManufacturer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await manufacturerService.updateManufacturer(
    id as string,
    payload,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Manufacturer updated successfully",
    data: result,
  });
});

const deleteManufacturer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await manufacturerService.deleteManufacturer(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Manufacturer deleted successfully",
    data: result,
  });
});

export const manufacturerController = {
  createManufacturer,
  updateManufacturer,
  deleteManufacturer,
  getAllManufacturer,
};
