import z from "zod";

const addToCartSchema = z.object({
  medicineId: z.string().uuid("Medicine id must be a valid UUID"),
  quantity: z.coerce
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than 0"),
});

const updateCartItemSchema = z
  .object({
    medicineId: z.string().uuid("Medicine id must be a valid UUID"),
    quantity: z.coerce
      .number()
      .int("Quantity must be an integer")
      .nonnegative("Quantity cannot be negative")
      .optional(),
    quantityChange: z.coerce
      .number()
      .int("Quantity change must be an integer")
      .refine((value) => value !== 0, {
        message: "Quantity change cannot be zero",
      })
      .optional(),
  })
  .refine(
    (payload) =>
      payload.quantity !== undefined || payload.quantityChange !== undefined,
    {
      message: "Either quantity or quantityChange is required",
    },
  )
  .refine(
    (payload) =>
      !(payload.quantity !== undefined && payload.quantityChange !== undefined),
    {
      message: "Provide only one of quantity or quantityChange",
    },
  );

export const cartValidation = {
  addToCartSchema,
  updateCartItemSchema,
};
