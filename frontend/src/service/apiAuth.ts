import api from "./api";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: any;
}

// Login
export async function login(email: string, password: string) {
  const res = await api.post("http://localhost:5000/api/auth/login", {
    email,
    password,
  });
  const { accessToken } = res.data;
  localStorage.setItem("access_token", accessToken);
  return res.data;
}

// Signup
export async function signup(
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await api.post("/auth/signup", {
    user_name: username,
    user_email: email,
    user_password: password,
  });
  const { accessToken, refreshToken } = res.data;
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
  return res.data;
}

// Logout
export async function logout() {
  localStorage.removeItem("access_token");
  return api.delete("/auth/logout");
}

// Get current user (protected route)
export async function getCurrentUser() {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No token");

  const res = await api.get("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}
