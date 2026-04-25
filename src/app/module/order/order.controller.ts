import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { orderService } from "./order.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const placeOrder = catchAsync(async (req: Request, res: Response) => {});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {});

const getOrderById = catchAsync(async (req: Request, res: Response) => {});

const getOrderByUserId = catchAsync(async (req: Request, res: Response) => {});

const getOrderBySellerId = catchAsync(
  async (req: Request, res: Response) => {},
);

const getOrderBySellerOrderId = catchAsync(
  async (req: Request, res: Response) => {},
);

const cancelOrder = catchAsync(async (req: Request, res: Response) => {});

const updateSellerOrderStatus = catchAsync(
  async (req: Request, res: Response) => {},
);

export const orderController = {
  placeOrder,
  getAllOrders,
  getOrderById,
  getOrderByUserId,
  getOrderBySellerId,
  getOrderBySellerOrderId,
  cancelOrder,
  updateSellerOrderStatus,
};
