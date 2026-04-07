import status from "http-status";
import { Category } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const createCategory = async (payload: Category): Promise<Category> => {
  const catergory = await prisma.category.create({
    data: payload,
  });
  return catergory;
};

const getAllCategory = async (): Promise<Category[]> => {
  const catergory = await prisma.category.findMany();
  return catergory;
};

const updateCategory = async (
  id: string,
  payload: Category,
): Promise<Category> => {
  const catergory = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });
  return catergory;
};

const deleteCategory = async (id: string): Promise<Category> => {
  const findMedicine = await prisma.medicine.findFirst({
    where: {
      categoryId: id,
    },
  });

  if (findMedicine) {
    throw new AppError(
      status.CONFLICT,
      "Category is associated with a medicine. Cannot delete.",
    );
  }
  const catergory = await prisma.category.delete({
    where: {
      id,
    },
  });
  return catergory;
};

export const categoryService = {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
};
