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

export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userData = req.body;

    if (!userId) {
      return next(new AppError("User ID is required", 400));
    }

    if (userData.user_role) {
      const allowedRoles = ["admin", "instructor", "user"];
      if (!allowedRoles.includes(userData.user_role)) {
        return next(
          new AppError(
            "Invalid role. Allowed roles: " + allowedRoles.join(", "),
            400
          )
        );
      }
    }

    if (userData.user_email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.user_email)) {
        return next(new AppError("Invalid email format", 400));
      }
    }

    const updatedUser = await UserModel.updateUserById(userId, userData);

    if (!updatedUser) {
      return next(new AppError("User not found", 404));
    }

    res.json({
      message: "User updated successfully",
      user: {
        user_id: updatedUser.user_id,
        user_name: updatedUser.user_name,
        user_email: updatedUser.user_email,
        user_role: updatedUser.user_role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return next(new AppError("User ID is required", 400));
    }

    const deletedUser = await UserModel.deleteUserById(userId);

    if (!deletedUser) {
      return next(new AppError("User not found", 404));
    }

    res.json({
      message: "User deleted successfully",
      user: {
        user_id: deletedUser.user_id,
        user_name: deletedUser.user_name,
        user_email: deletedUser.user_email,
        user_role: deletedUser.user_role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return next(new AppError("User ID is required", 400));
    }

    const user = await UserModel.getUserById(userId);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.json({
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        user_role: user.user_role,
      },
    });
  } catch (err) {
    next(err);
  }
};
