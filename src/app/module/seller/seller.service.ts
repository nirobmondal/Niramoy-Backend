import status from "http-status";
import { OrderStatus, Role, Seller } from "../../../generated/prisma/client";
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

  const sellerProfile = await prisma.$transaction(async (tx) => {
    const seller = await tx.seller.create({
      data: {
        ...payload,
      },
      include: {
        user: true,
      },
    });

    await tx.user.update({
      where: {
        id: payload.userId,
      },
      data: {
        role: Role.SELLER,
      },
    });
    return seller;
  });

  return sellerProfile;
};

const updateSellerProfile = async (
  userId: string,
  payload: Partial<Seller>,
): Promise<Seller> => {
  const seller = await prisma.seller.findUnique({
    where: {
      userId,
    },
  });

  if (!seller) {
    throw new AppError(status.NOT_FOUND, "Seller profile not found");
  }
  const sellerProfile = await prisma.seller.update({
    where: {
      id: seller.id,
    },
    data: {
      ...payload,
    },
  });
  return sellerProfile;
};

const getSellerDashboard = async (userId: string) => {
  const seller = await prisma.seller.findUnique({
    where: {
      userId,
    },
  });

  if (!seller) {
    throw new AppError(status.NOT_FOUND, "Seller profile not found");
  }

  const sellerId = seller.id;

  const totalOrder = await prisma.sellerOrder.count({
    where: {
      sellerId,
    },
  });

  const totalMedicine = await prisma.medicine.count({
    where: {
      sellerId,
    },
  });

  const totalSales = await prisma.sellerOrder.count({
    where: {
      sellerId,
      order: {
        status: OrderStatus.DELIVERED,
      },
    },
  });

  const totalRevenueResult = await prisma.sellerOrder.aggregate({
    where: {
      sellerId,
      order: {
        status: OrderStatus.DELIVERED,
      },
    },
    _sum: {
      totalAmount: true,
    },
  });

  const totalRevenue = totalRevenueResult._sum.totalAmount || 0;

  return {
    totalOrder,
    totalMedicine,
    totalSales,
    totalRevenue,
  };
};

export const sellerService = {
  createSellerProfile,
  updateSellerProfile,
  getSellerDashboard,
};
