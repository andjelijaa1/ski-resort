import type { User } from "@/types/types";
import api from "./api";

export async function getAllUsers() {
  const res = await api.get("/users");
  return res.data;
}

export interface UpdateUserData {
  user_name?: string;
  user_email?: string;
  user_role?: "admin" | "instructor" | "user";
}

export async function updateUserRole(email: string, role: string) {
  const res = await api.put("/users/update-role", { email, role });
  return res.data;
}

export async function updateUser(userId: string, userData: UpdateUserData) {
  const res = await api.put(`/users/${userId}`, userData);
  return res.data;
}

export async function deleteUser(userId: string) {
  const res = await api.delete(`/users/${userId}`);
  return res.data;
}

export async function getUserById(userId: string): Promise<User> {
  const res = await api.get(`/users/${userId}`);
  return res.data;
}
