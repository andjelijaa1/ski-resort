import type { User } from "@/types/types";
import api from "./api";

// ---------- USERS ----------
export async function getAllUsers() {
  const res = await api.get("/users");
  return res.data;
}

export async function updateUserRole(email: string, role: string) {
  const res = await api.put("/users/update-role", { email, role });
  return res.data;
}

export interface UpdateUserData {
  user_name?: string;
  user_email?: string;
  user_role?: "admin" | "instructor" | "user";
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

// ---------- ROOMS ----------
export async function getAllRooms() {
  const res = await api.get("/rooms");
  return res.data;
}

export async function getRoomById(number: string) {
  const res = await api.get(`/rooms/${number}`);
  return res.data;
}

export async function updateRoom(roomId: string, roomData: any) {
  const res = await api.put(`/rooms/${roomId}`, roomData);
  return res.data;
}

export async function deleteRoom(roomId: string) {
  const res = await api.delete(`/rooms/${roomId}`);
  return res.data;
}

// ---------- EQUIPMENT ----------
export async function getAllEq() {
  const res = await api.get("/equipment");
  return res.data;
}

export async function updateEquipment(id: string, equipmentData: any) {
  const res = await api.put(`/equipment/${id}`, equipmentData);
  return res.data;
}

export async function deleteEquipment(id: string) {
  const res = await api.delete(`/equipment/${id}`);
  return res.data;
}
