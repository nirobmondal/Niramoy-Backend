import z from "zod";

const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(120, "Category name must be at most 120 characters"),
  description: z
    .string()
    .trim()
    .max(255, "Description must be at most 255 characters")
    .optional(),
});

const updateCategorySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(120, "Category name must be at most 120 characters")
      .optional(),
    description: z
      .string()
      .trim()
      .max(255, "Description must be at most 255 characters")
      .optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for update",
  });

export const categoryValidation = {
  createCategorySchema,
  updateCategorySchema,
};
