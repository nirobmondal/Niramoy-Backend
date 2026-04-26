import z from "zod";

const createSellerProfileSchema = z.object({
  shopName: z
    .string()
    .trim()
    .min(2, "Shop name must be at least 2 characters")
    .max(120, "Shop name must be at most 120 characters"),
  shopAddress: z
    .string()
    .trim()
    .min(5, "Shop address is required")
    .max(255, "Shop address must be at most 255 characters"),
  shopPhone: z
    .string()
    .trim()
    .regex(/^[+]?\d{8,15}$/, "Shop phone must contain 8 to 15 digits"),
});

export const sellerValidation = {
  createSellerProfileSchema,
};
