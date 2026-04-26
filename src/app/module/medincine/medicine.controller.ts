import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { medicineService } from "./medicine.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createMedicine = catchAsync(async (req: Request, res: Response) => {});

const getMedicineById = catchAsync(async (req: Request, res: Response) => {});

const getAllMedicines = catchAsync(async (req: Request, res: Response) => {});

const getMedicineBySellerId = catchAsync(
  async (req: Request, res: Response) => {},
);

const updateMedicine = catchAsync(async (req: Request, res: Response) => {});

const deleteMedicine = catchAsync(async (req: Request, res: Response) => {});

export const medicineController = {
  createMedicine,
  getMedicineById,
  getAllMedicines,
  getMedicineBySellerId,
  updateMedicine,
  deleteMedicine,
};
