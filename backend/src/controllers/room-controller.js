import * as RoomModel from "../models/room-model";

export const getRooms = async (req, res, next) => {
  try {
    const rooms = await RoomModel.getAllRooms();
    res.json({ users });
  } catch (err) {
    next(err);
  }
};
