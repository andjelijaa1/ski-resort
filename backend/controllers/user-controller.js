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

export const updateUserRole = async (req, res, next) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return next(new AppError("Email and role are required", 400));
    }

    const allowedRoles = ["admin", "instructor", "user"];
    if (!allowedRoles.includes(role)) {
      return next(
        new AppError(
          "Invalid role. Allowed roles: " + allowedRoles.join(", "),
          400
        )
      );
    }

    const updatedUser = await UserModel.updateUserRoleByEmail(email, role);

    if (!updatedUser) {
      return next(new AppError("User not found!", 404));
    }

    res.json({
      message: "User role updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        user_name: updatedUser.user_name,
        user_role: updatedUser.user_role,
      },
    });
  } catch (err) {
    next(err);
  }
};
