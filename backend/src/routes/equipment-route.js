import express from "express";
import {
  getEq,
  getSingleEquipment,
  createNewEquipment,
  updateEquipment,
  deleteEquipment,
} from "../controllers/equipment-controller.js";

const router = express.Router();

router.get("/", getEq);
router.get("/:id", getSingleEquipment);
router.post("/", createNewEquipment);
router.put("/:id", updateEquipment);
router.delete("/:id", deleteEquipment);

export default router;
