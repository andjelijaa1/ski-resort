import express from "express";
import * as RoomController from "../controllers/room-controller";
const router = express.Router();

router.get("/", RoomController.getRooms);
