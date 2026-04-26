import status from "http-status";
import { OrderStatus, Role } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const getCustomerStats = async (userId: string) => {
  const [orderCount, amountAgg, medicineAgg] = await Promise.all([
    prisma.order.count({
      where: {
        customerId: userId,
      },
    }),
    prisma.order.aggregate({
      where: {
        customerId: userId,
        status: {
          not: OrderStatus.CANCELLED,
        },
      },
      _sum: {
        totalAmount: true,
      },
    }),
    prisma.orderItem.aggregate({
      where: {
        sellerOrder: {
          order: {
            customerId: userId,
            status: {
              not: OrderStatus.CANCELLED,
            },
          },
        },
      },
      _sum: {
        quantity: true,
      },
    }),
  ]);

  return {
    totalOrderCount: orderCount,
    totalAmountSpent: Number(amountAgg._sum.totalAmount ?? 0),
    totalMedicineBought: medicineAgg._sum.quantity ?? 0,
  };
};

const getSellerStats = async (userId: string) => {
  const seller = await prisma.seller.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!seller) {
    throw new AppError(status.NOT_FOUND, "Seller profile not found");
  }

  const [orderRows, deliveredOrderRows, revenueAgg, soldAgg] =
    await Promise.all([
      prisma.sellerOrder.findMany({
        where: {
          sellerId: seller.id,
        },
        select: {
          orderId: true,
        },
        distinct: ["orderId"],
      }),
      prisma.sellerOrder.findMany({
        where: {
          sellerId: seller.id,
          order: {
            status: OrderStatus.DELIVERED,
          },
        },
        select: {
          orderId: true,
        },
        distinct: ["orderId"],
      }),
      prisma.sellerOrder.aggregate({
        where: {
          sellerId: seller.id,
          order: {
            status: OrderStatus.DELIVERED,
          },
        },
        _sum: {
          subtotal: true,
        },
      }),
      prisma.orderItem.aggregate({
        where: {
          sellerOrder: {
            sellerId: seller.id,
            order: {
              status: OrderStatus.DELIVERED,
            },
          },
        },
        _sum: {
          quantity: true,
        },
      }),
    ]);

  const totalRevenue = Number(revenueAgg._sum.subtotal ?? 0);

  return {
    totalOrderCount: orderRows.length,
    totalSales: deliveredOrderRows.length,
    totalAmountEarned: totalRevenue,
    totalRevenue,
    totalMedicineSold: soldAgg._sum.quantity ?? 0,
  };
};

const getAdminStats = async () => {
  const [
    totalUsersCount,
    totalSellerCount,
    totalCustomerCount,
    totalAdminCount,
    totalOrdersCount,
    earningAgg,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        role: Role.SELLER,
      },
    }),
    prisma.user.count({
      where: {
        role: Role.CUSTOMER,
      },
    }),
    prisma.user.count({
      where: {
        role: Role.ADMIN,
      },
    }),
    prisma.order.count(),
    prisma.order.aggregate({
      where: {
        status: OrderStatus.DELIVERED,
      },
      _sum: {
        totalAmount: true,
      },
    }),
  ]);

  return {
    totalUsersCount,
    totalSellerCount,
    totalCustomerCount,
    totalAdminCount,
    totalOrdersCount,
    totalPlatformAmountEarned: Number(earningAgg._sum.totalAmount ?? 0),
  };
};

const getDashboardStatsData = async (userId: string, role: Role) => {
  switch (role) {
    case Role.CUSTOMER:
      return getCustomerStats(userId);
    case Role.SELLER:
      return getSellerStats(userId);
    case Role.ADMIN:
      return getAdminStats();
    default:
      throw new AppError(status.FORBIDDEN, "Unsupported user role");
  }
};

export const statsService = {
  getDashboardStatsData,
};
