import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtTokens } from "../utils/jwt-tokens.js";
import * as UserModel from "../models/user-model.js";
import AppError from "../utils/AppError.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

export const signup = async (req, res, next) => {
  try {
    const { user_name, user_email, user_password } = req.body;

    const userExists = await UserModel.findUserByEmail(user_email);
    if (userExists) return next(new AppError("Email already registered!", 400));

    const hashedPassword = await bcrypt.hash(user_password, 10);
    const newUser = await UserModel.createUser(
      user_name,
      user_email,
      hashedPassword
    );

    const tokens = jwtTokens(newUser);

    res.cookie("refresh_token", tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("access_token", tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    const { user_password: _, ...userWithoutPassword } = newUser;
    res.json({ user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findUserByEmail(email);
    if (!user) return next(new AppError("Email not found!", 401));

    const correctPassword = await bcrypt.compare(password, user.user_password);
    if (!correctPassword) return next(new AppError("Incorrect password!", 401));

    const tokens = jwtTokens(user);

    res.cookie("refresh_token", tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("access_token", tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    const { user_password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
};

export const refresh = (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) return next(new AppError("No refresh token", 401));

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return next(new AppError("Invalid refresh token", 403));

      const tokens = jwtTokens(user);

      res.cookie("access_token", tokens.accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      });
      res.json({ success: true });
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie("refresh_token", cookieOptions);
  res.clearCookie("access_token", cookieOptions);
  res.json({ message: "Logged out successfully" });
};
