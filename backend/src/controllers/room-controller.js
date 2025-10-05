import * as RoomModel from "../models/room-model.js";
import AppError from "../utils/AppError.js";

// GET /api/rooms
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await RoomModel.getAllRooms();
    res.status(200).json({ rooms });
  } catch (err) {
    next(new AppError("Failed to fetch rooms", 500));
  }
};

// GET /api/rooms/:number
export const getRoomById = async (req, res, next) => {
  try {
    const { number } = req.params;

    if (!number) {
      return next(new AppError("Room number is required", 400));
    }

    const room = await RoomModel.getRoom(number);

    if (!room) {
      return next(new AppError("Room not found", 404));
    }

    res.status(200).json({ room });
  } catch (err) {
    next(new AppError("Failed to fetch room details", 500));
  }
};

// PUT /api/rooms/:id
export const updateRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedRoom = await RoomModel.updateRoomById(id, req.body);

    if (!updatedRoom) {
      return next(new AppError("Room not found", 404));
    }

    res.status(200).json(updatedRoom);
  } catch (err) {
    next(new AppError("Failed to update room", 500));
  }
};

// DELETE /api/rooms/:id
export const deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedRoom = await RoomModel.deleteRoomById(id);

    if (!deletedRoom) {
      return next(new AppError("Room not found", 404));
    }

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (err) {
    next(new AppError("Failed to delete room", 500));
  }
};
