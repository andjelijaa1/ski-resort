import * as UserModel from "../models/user-model.js";
import AppError from "../utils/AppError.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json({ users });
  } catch (error) {
    next(err);
  }
};

export const getMe = (req, res, next) => {
  try {
    if (!req.user) {
      return next(new AppError("Not authenticated", 401));
    }
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

export const deleteAll = async (req, res, next) => {
  try {
    const users = await UserModel.deleteAllUsers();
    res.json({
      message: "Deleted all users except super_admin and testuser",
      deletedUsers: users,
    });
  } catch (err) {
    next(err);
  }
};
