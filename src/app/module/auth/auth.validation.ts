import z from "zod";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const registerCustomerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z.string().trim().email("Please provide a valid email").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      strongPasswordRegex,
      "Password must include uppercase, lowercase, number and special character",
    ),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?\d{8,15}$/, "Phone must contain 8 to 15 digits")
    .optional(),
  image: z.string().url("Image must be a valid URL").optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

const updateMeSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters")
      .optional(),
    phone: z
      .string()
      .trim()
      .regex(/^[+]?\d{8,15}$/, "Phone must contain 8 to 15 digits")
      .optional(),
    image: z.string().url("Image must be a valid URL").optional(),
    sellerProfile: z
      .object({
        shopName: z
          .string()
          .trim()
          .min(2, "Shop name must be at least 2 characters")
          .max(120, "Shop name must be at most 120 characters")
          .optional(),
        shopAddress: z
          .string()
          .trim()
          .max(255, "Shop address must be at most 255 characters")
          .optional(),
        shopPhone: z
          .string()
          .trim()
          .regex(/^[+]?\d{8,15}$/, "Shop phone must contain 8 to 15 digits")
          .optional(),
      })
      .optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for update",
  });

const refreshTokenSchema = z.object({});

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(
        strongPasswordRegex,
        "New password must include uppercase, lowercase, number and special character",
      ),
  })
  .refine((value) => value.currentPassword !== value.newPassword, {
    path: ["newPassword"],
    message: "New password must be different from current password",
  });

const verifyEmailSchema = z.object({
  email: z.string().trim().email("Please provide a valid email").toLowerCase(),
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please provide a valid email").toLowerCase(),
});

const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Please provide a valid email")
      .toLowerCase(),
    otp: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "OTP must be 6 digits"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(
        strongPasswordRegex,
        "New password must include uppercase, lowercase, number and special character",
      ),
  })
  .strict();

export const AuthValidation = {
  registerCustomerSchema,
  loginSchema,
  updateMeSchema,
  refreshTokenSchema,
  changePasswordSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
