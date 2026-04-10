import status from "http-status";
import { Seller } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";

import { prisma } from "../../lib/prisma";

const createSellerProfile = async (payload: Seller): Promise<Seller> => {
  const isSellerProfileExist = await prisma.seller.findUnique({
    where: {
      userId: payload.userId,
    },
  });

  if (isSellerProfileExist) {
    throw new AppError(status.CONFLICT, "Seller profile already exists");
  }

  const sellerProfile = await prisma.seller.create({
    data: {
      ...payload,
    },
  });
  return sellerProfile;
};

const updateSellerProfile = async (
  id: string,
  payload: Partial<Seller>,
): Promise<Seller> => {
  const sellerProfile = await prisma.seller.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
  });
  return sellerProfile;
};

export const sellerService = {
  createSellerProfile,
  updateSellerProfile,
};
