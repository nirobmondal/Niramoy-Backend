import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { medicineService } from "./medicine.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { IUpdateMedicinePayload } from "./medicine.interface";
import { IQueryParams } from "../../interfaces/query.interface";

const createMedicine = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    imageUrl: req.file?.path || req.body.imageUrl,
  };
  const result = await medicineService.createMedicine(req.user.userId, payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Medicine created successfully",
    data: result,
  });
});

const getMedicineById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await medicineService.getMedicineById(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Medicine fetched successfully",
    data: result,
  });
});

const getAllMedicines = catchAsync(async (req: Request, res: Response) => {
  const result = await medicineService.getAllMedicines(
    req.query as unknown as IQueryParams,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Medicines fetched successfully",
    data: result,
  });
});

const getMedicineBySellerId = catchAsync(
  async (req: Request, res: Response) => {
    const result = await medicineService.getMedicineBySellerId(
      req.user.userId,
      req.query as unknown as IQueryParams,
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Medicines fetched successfully",
      data: result,
    });
  },
);

const updateMedicine = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload: IUpdateMedicinePayload = {
    ...req.body,
    imageUrl: req.file?.path || req.body.imageUrl,
  };
  const result = await medicineService.updateMedicine(
    id as string,
    req.user.userId,
    payload,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Medicine updated successfully",
    data: result,
  });
});

const deleteMedicine = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await medicineService.deleteMedicine(
    id as string,
    req.user.userId,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Medicine deleted successfully",
    data: result,
  });
});

export const medicineController = {
  createMedicine,
  getMedicineById,
  getAllMedicines,
  getMedicineBySellerId,
  updateMedicine,
  deleteMedicine,
};
