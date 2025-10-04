import express from "express";
import * as UserController from "../controllers/user-controller.js";
import authorizeRoles from "../middleware/roleAuth.js";

const router = express.Router();

router.get(
  "/",
  authorizeRoles("super_admin", "admin", "instructor"),
  UserController.getUsers
);

router.get(
  "/me",

  UserController.getMe
);
router.delete(
  "/delete-all",
  authorizeRoles("super_admin"),
  UserController.deleteAll
);

router.put(
  "/update-role",
  authorizeRoles("super_admin", "admin"),
  UserController.updateUserRole
);

router.get(
  "/:userId",
  authorizeRoles("super_admin", "admin"),
  UserController.getUser
);

router.put(
  "/:userId",
  authorizeRoles("super_admin", "admin"),
  UserController.updateUser
);

router.delete(
  "/:userId",
  authorizeRoles("super_admin", "admin"),
  UserController.deleteUser
);

router.put(
  "/update-role",
  authorizeRoles("super_admin", "admin"),
  UserController.updateUserRole
);

export default router;
