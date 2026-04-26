import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IAddToCartPayload, IUpdateCartPayload } from "./cart.interface";

const addToCart = async () => {};

const getCartItems = async () => {};

const updateCartItem = async () => {};

const deleteCartItem = async () => {};

const clearCart = async () => {};

export const cartService = {
  addToCart,
  getCartItems,
  updateCartItem,
  deleteCartItem,
  clearCart,
};
