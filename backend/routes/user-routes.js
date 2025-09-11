import express from "express";
import * as UserController from "../controllers/user-controller.js";
import authorizeRoles from "../middleware/roleAuth.js";

const router = express.Router();

router.get("/", UserController.getUsers);
router.get(
  "/me",
  (authorizeRoles = "admin,instructor,super_admin"),
  UserController.getMe
);
router.delete(
  "/delete-all",
  (authorizeRoles = "super_admin"),
  UserController.deleteAll
);

export default router;
