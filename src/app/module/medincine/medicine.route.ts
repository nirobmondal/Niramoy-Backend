import { Router } from "express";
import { medicineController } from "./medicine.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", medicineController.getAllMedicines);
router.get("/:id", medicineController.getMedicineById);
router.post("/", checkAuth(Role.SELLER), medicineController.createMedicine);
router.get(
  "/seller",
  checkAuth(Role.SELLER),
  medicineController.getMedicineBySellerId,
);
router.put("/:id", checkAuth(Role.SELLER), medicineController.updateMedicine);
router.delete(
  "/:id",
  checkAuth(Role.SELLER),
  medicineController.deleteMedicine,
);

export const medicineRoute = router;
