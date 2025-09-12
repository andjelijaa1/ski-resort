import pool from "../db/config.js";

export const findUserByEmail = async (email) => {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE user_email = $1",
    [email]
  );
  return rows[0];
};

export const createUser = async (name, email, hashedPassword) => {
  const { rows } = await pool.query(
    "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, hashedPassword]
  );
  return rows[0];
};

export const getAllUsers = async () => {
  const { rows } = await pool.query(`
    SELECT user_id, user_name, user_email, user_role
    FROM users
    WHERE user_role != 'super_admin' 
  `);
  return rows;
};

export const deleteAllUsers = async () => {
  const { rows } = await pool.query(
    `DELETE FROM users 
     WHERE user_role != 'super_admin'
     RETURNING *`
  );
  return rows;
};

export const updateUserRoleByEmail = async (email, newRole) => {
  const { rows } = await pool.query(
    `UPDATE users 
     SET user_role = $1 
     WHERE user_email = $2 
     RETURNING *`,
    [newRole, email]
  );
  return rows[0];
};
