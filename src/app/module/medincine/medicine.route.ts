import { Router } from "express";
import { medicineController } from "./medicine.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";
import { medicineValidation } from "./medicine.validation";

const router = Router();

router.get("/", medicineController.getAllMedicines);
router.get(
  "/seller",
  checkAuth(Role.SELLER),
  medicineController.getMedicineBySellerId,
);
router.get("/:id", medicineController.getMedicineById);
router.post(
  "/",
  checkAuth(Role.SELLER),
  multerUpload.single("file"),
  validateRequest(medicineValidation.createMedicineSchema),
  medicineController.createMedicine,
);
router.patch(
  "/:id",
  checkAuth(Role.SELLER),
  multerUpload.single("file"),
  validateRequest(medicineValidation.updateMedicineSchema),
  medicineController.updateMedicine,
);
router.delete(
  "/:id",
  checkAuth(Role.SELLER),
  medicineController.deleteMedicine,
);

export const medicineRoute = router;
