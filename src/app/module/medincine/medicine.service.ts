import { MedicineWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  ICreateMedicinePayload,
  IUpdateMedicinePayload,
} from "./medicine.interface";

const createMedicine = async () => {};

const getAllMedicines = async () => {};

const getMedicineById = async () => {};

const getMedicineBySellerId = async () => {};

const updateMedicine = async () => {};

// soft delete(set stock and price to 0 and isAvailable to false)
const deleteMedicine = async () => {};

export const medicineService = {
  createMedicine,
  getMedicineById,
  getAllMedicines,
  getMedicineBySellerId,
  updateMedicine,
  deleteMedicine,
};
