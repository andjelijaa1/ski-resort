import express from "express";
import pool from "../db/config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtTokens } from "../utils/jwt-tokens.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { user_name, user_email, user_password } = req.body;
    const hashedPassword = await bcrypt.hash(user_password, 10);
    const userExists = await pool.query(
      "SELECT * FROM users WHERE user_email = $1",
      [user_email]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered!" });
    }
    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [user_name, user_email, hashedPassword]
    );
    const tokens = jwtTokens(newUser.rows[0]);

    // Čuvaj oba tokena u cookie-jima
    res.cookie("refresh_token", tokens.refreshToken, {
      ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dana
    });

    res.cookie("access_token", tokens.accessToken, {
      ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minuta
    });

    // Ukloni password iz response-a
    const { user_password: __, ...userWithoutPassword } = newUser.rows[0];
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Email not found!" });
    }
    const correctPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );
    if (!correctPassword) {
      return res.status(401).json({ message: "Incorrect password!" });
    }

    const tokens = jwtTokens(user.rows[0]);

    // Čuvaj oba tokena u cookie-jima
    res.cookie("refresh_token", tokens.refreshToken, {
      ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dana
    });

    res.cookie("access_token", tokens.accessToken, {
      ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minuta
    });

    // Ukloni password iz response-a
    const { user_password: __, ...userWithoutPassword } = user.rows[0];
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Refresh – cookie based
router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const tokens = jwtTokens({
      user_id: user.user_id,
      user_name: user.user_name,
      user_email: user.user_email,
      user_role: user.role,
    });

    // Postavi novi access token u cookie
    res.cookie("access_token", tokens.accessToken, {
      ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minuta
    });

    res.json({ success: true });
  });
});

// Logout
router.delete("/logout", (req, res) => {
  res.clearCookie("refresh_token", {
    ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.clearCookie("access_token", {
    ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.json({ message: "Logged out successfully" });
});

export default router;
