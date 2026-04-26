import z from "zod";

const createManufacturerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Manufacturer name must be at least 2 characters")
    .max(120, "Manufacturer name must be at most 120 characters"),
  country: z
    .string()
    .trim()
    .max(100, "Country must be at most 100 characters")
    .optional(),
});

const updateManufacturerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Manufacturer name must be at least 2 characters")
      .max(120, "Manufacturer name must be at most 120 characters")
      .optional(),
    country: z
      .string()
      .trim()
      .max(100, "Country must be at most 100 characters")
      .optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for update",
  });

export const manufacturerValidation = {
  createManufacturerSchema,
  updateManufacturerSchema,
};
