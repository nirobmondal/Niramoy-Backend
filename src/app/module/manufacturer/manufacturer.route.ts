import { Router } from "express";
import { manufacturerController } from "./manufacturer.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { manufacturerValidation } from "./manufacturer.validation";

const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(manufacturerValidation.createManufacturerSchema),
  manufacturerController.createManufacturer,
);

router.get("/", manufacturerController.getAllManufacturer);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(manufacturerValidation.updateManufacturerSchema),
  manufacturerController.updateManufacturer,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN),
  manufacturerController.deleteManufacturer,
);

export const manufacturerRoute = router;
