import pool from "../db/config";

export const getAllRooms = async () => {
  const { rooms } = await pool.query(`SELECT * rooms`);
  return rooms;
};
