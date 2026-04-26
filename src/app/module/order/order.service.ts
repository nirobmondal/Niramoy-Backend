import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { cartService } from "../cart/cart.service";
import { ICreateOrderPayload } from "./order.interface";
import { OrderStatus, PaymentStatus } from "../../../generated/prisma/enums";

const placeOrder = async () => {};

const getAllOrders = async () => {};

const getOrderById = async () => {};

const getOrderByUserId = async () => {};

const getOrderBySellerId = async () => {};

const getOrderBySellerOrderId = async () => {};

const cancelOrder = async () => {};

const updateSellerOrderStatus = async () => {};

export const orderService = {
  placeOrder,
  getAllOrders,
  getOrderById,
  getOrderByUserId,
  getOrderBySellerId,
  getOrderBySellerOrderId,
  cancelOrder,
  updateSellerOrderStatus,
};
