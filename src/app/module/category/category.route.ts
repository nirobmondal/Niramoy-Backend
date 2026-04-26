import { Router } from "express";
import { categoryController } from "./category.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { categoryValidation } from "./category.validation";

const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(categoryValidation.createCategorySchema),
  categoryController.createCategory,
);
router.get("/", categoryController.getAllCategory);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(categoryValidation.updateCategorySchema),
  categoryController.updateCategory,
);
router.delete("/:id", checkAuth(Role.ADMIN), categoryController.deleteCategory);

export const categoryRoute = router;
