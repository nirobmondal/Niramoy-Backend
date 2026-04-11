import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { orderService } from "./order.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const placeOrder = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const payload = req.body;

  const order = await orderService.placeOrder(userId, payload);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Order placed successfully",
    data: order,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await orderService.getAllOrders();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Orders fetched successfully",
    data: orders,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await orderService.getOrderById(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Order fetched successfully",
    data: order,
  });
});

const getOrderByUserId = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;

  const orders = await orderService.getOrderByUserId(userId);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Orders fetched successfully",
    data: orders,
  });
});

const getOrderBySellerId = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;

  const orders = await orderService.getOrderBySellerId(userId);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Orders fetched successfully",
    data: orders,
  });
});

const getOrderBySellerOrderId = catchAsync(
  async (req: Request, res: Response) => {
    const { sellerOrderId } = req.params;

    const order = await orderService.getOrderBySellerOrderId(
      sellerOrderId as string,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  },
);

const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.user;

  const order = await orderService.cancelOrder(id as string, userId);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Order cancelled successfully",
    data: order,
  });
});

const updateSellerOrderStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.user;
    const { sellerOrderId } = req.params;
    const { status } = req.body;

    const order = await orderService.updateSellerOrderStatus(
      userId as string,
      sellerOrderId as string,
      status,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  },
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
