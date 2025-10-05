import pool from "../db/config.js";

export const getAllEquipment = async () => {
  const { rows } = await pool.query(`SELECT * FROM equipment`);
  return rows;
};

// Get one equipment by ID
export const getEquipmentById = async (equipmentId) => {
  const { rows } = await pool.query(
    `SELECT * FROM equipment WHERE equipment_id = $1`,
    [equipmentId]
  );
  return rows[0];
};

// Create new equipment
export const createEquipment = async (data) => {
  const {
    equipment_type,
    size,
    brand,
    model,
    price_per_day,
    available_quantity,
    total_quantity,
    is_active,
    equipment_image_url,
  } = data;

  const { rows } = await pool.query(
    `
    INSERT INTO equipment (
      equipment_type, size, brand, model, price_per_day,
      available_quantity, total_quantity, is_active, equipment_image_url
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
    `,
    [
      equipment_type,
      size,
      brand,
      model,
      price_per_day,
      available_quantity,
      total_quantity,
      is_active,
      equipment_image_url,
    ]
  );
  return rows[0];
};

// Update equipment by ID
export const updateEquipmentById = async (equipmentId, data) => {
  const {
    equipment_type,
    size,
    brand,
    model,
    price_per_day,
    available_quantity,
    total_quantity,
    is_active,
    equipment_image_url,
  } = data;

  const { rows } = await pool.query(
    `
    UPDATE equipment
    SET equipment_type=$1,
        size=$2,
        brand=$3,
        model=$4,
        price_per_day=$5,
        available_quantity=$6,
        total_quantity=$7,
        is_active=$8,
        equipment_image_url=$9
    WHERE equipment_id=$10
    RETURNING *
    `,
    [
      equipment_type,
      size,
      brand,
      model,
      price_per_day,
      available_quantity,
      total_quantity,
      is_active,
      equipment_image_url,
      equipmentId,
    ]
  );
  return rows[0];
};

// Delete equipment by ID
export const deleteEquipmentById = async (equipmentId) => {
  const { rows } = await pool.query(
    `DELETE FROM equipment WHERE equipment_id = $1 RETURNING *`,
    [equipmentId]
  );
  return rows[0];
};
