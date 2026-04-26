import z from "zod";
import { OrderStatus } from "../../../generated/prisma/enums";

const createOrderSchema = z.object({
  shippingName: z
    .string()
    .trim()
    .min(2, "Shipping name must be at least 2 characters")
    .max(120, "Shipping name must be at most 120 characters"),
  shippingPhone: z
    .string()
    .trim()
    .min(6, "Shipping phone must be at least 6 characters")
    .max(30, "Shipping phone must be at most 30 characters"),
  shippingAddress: z
    .string()
    .trim()
    .min(5, "Shipping address must be at least 5 characters")
    .max(255, "Shipping address must be at most 255 characters"),
  shippingCity: z
    .string()
    .trim()
    .min(2, "Shipping city must be at least 2 characters")
    .max(100, "Shipping city must be at most 100 characters"),
  note: z
    .string()
    .trim()
    .max(500, "Note must be at most 500 characters")
    .optional(),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(OrderStatus).refine((value) => value !== OrderStatus.PLACED, {
    message: "Order status cannot be set to PLACED manually",
  }),
});

export const orderValidation = {
  createOrderSchema,
  updateOrderStatusSchema,
};
