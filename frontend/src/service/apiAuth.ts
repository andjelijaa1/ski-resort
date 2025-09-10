import api from "./api";

export interface AuthResponse {
  user?: any;
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export async function signup({
  user_name,
  email,
  password,
}: {
  user_name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await api.post("/auth/signup", {
    user_name,
    user_email: email,
    user_password: password,
  });
  return res.data;
}

export async function logout() {
  return api.delete("/auth/logout");
}

export async function getCurrentUser() {
  const res = await api.get("/users/me");
  return res.data;
}
