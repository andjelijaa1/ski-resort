import express from "express";
import * as RoomController from "../controllers/room-controller.js";

const router = express.Router();

router.get("/", RoomController.getRooms);
router.put("/:id", RoomController.updateRoom);
router.delete("/:id", RoomController.deleteRoom);
router.get("/:number", RoomController.getRoomById);

export default router;
