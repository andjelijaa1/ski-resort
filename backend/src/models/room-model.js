import pool from "../db/config.js";

export const getAllRooms = async () => {
  const { rows } = await pool.query(`SELECT * FROM rooms ORDER BY room_number`);
  return rows;
};

export const updateRoomById = async (roomId, data) => {
  const { room_number, capacity, price_per_night, description, is_active } =
    data;

  const query = `
    UPDATE rooms
    SET 
      room_number = $1,
      capacity = $2,
      price_per_night = $3,
      description = $4,
      is_active = $5
    WHERE room_id = $6
    RETURNING *;
  `;

  const values = [
    room_number,
    capacity,
    price_per_night,
    description,
    is_active,
    roomId,
  ];
  const { rows } = await pool.query(query, values);

  return rows[0];
};

export const deleteRoomById = async (roomId) => {
  const { rows } = await pool.query(
    `DELETE FROM rooms WHERE room_id = $1 RETURNING *;`,
    [roomId]
  );
  return rows[0];
};

export const getRoom = async (room_number) => {
  const { rows } = await pool.query(
    "SELECT * from rooms where room_number = $1",
    [room_number]
  );
  return rows[0];
};
