import * as EqModel from "../models/equipment-models.js";
import AppError from "../utils/AppError.js";

// GET /api/equipment
export const getEq = async (req, res, next) => {
  try {
    const equipment = await EqModel.getAllEquipment();
    res.json({ equipment });
  } catch (err) {
    next(new AppError("Failed to fetch equipment list", 500));
  }
};

// GET /api/equipment/:id
export const getSingleEquipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const equipment = await EqModel.getEquipmentById(id);

    if (!equipment) {
      return next(new AppError("Equipment not found", 404));
    }

    res.json(equipment);
  } catch (err) {
    next(new AppError("Failed to fetch equipment", 500));
  }
};

// POST /api/equipment
export const createNewEquipment = async (req, res, next) => {
  try {
    const equipment = await EqModel.createEquipment(req.body);
    res.status(201).json(equipment);
  } catch (err) {
    next(new AppError("Failed to create equipment", 500));
  }
};

// PUT /api/equipment/:id
export const updateEquipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await EqModel.updateEquipmentById(id, req.body);

    if (!updated) {
      return next(new AppError("Equipment not found", 404));
    }

    res.json(updated);
  } catch (err) {
    next(new AppError("Failed to update equipment", 500));
  }
};

// DELETE /api/equipment/:id
export const deleteEquipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await EqModel.deleteEquipmentById(id);

    if (!deleted) {
      return next(new AppError("Equipment not found", 404));
    }

    res.json({ message: "Equipment deleted successfully" });
  } catch (err) {
    next(new AppError("Failed to delete equipment", 500));
  }
};
