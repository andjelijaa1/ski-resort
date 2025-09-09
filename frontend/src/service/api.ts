import axios, { AxiosError } from "axios";
import type { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) prom.resolve(token);
    else prom.reject(error);
  });
  failedQueue = [];
};

// u memory držimo access token
let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};
export const getAccessToken = () => accessToken;

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // Proveravamo da li je greška 401 I da li je zbog expired tokena
    // Ali NE za login/signup/refresh rute jer one mogu legitimno da vrate 401
    const isAuthRoute = originalRequest.url?.includes("/auth/");
    const isLoginOrSignup =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/signup") ||
      originalRequest.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoginOrSignup &&
      accessToken // Samo ako imamo access token (znači da smo bili ulogovani)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          "http://localhost:5000/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);

        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        // Ponovimo originalni zahtev sa novim tokenom
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null);

        // Logout samo ako refresh ne uspe
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Prosleđujemo originalnu grešku dalje bez promene
    // Ovo omogućava da vaši endpointi sačuvaju svoje error poruke
    return Promise.reject(error);
  }
);

export default api;
