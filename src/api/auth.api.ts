import axios from "axios";
import { AUTH_API_BASE_URL } from "../utils/constants";

const api = axios.create({
  baseURL: `${AUTH_API_BASE_URL}/api/auth`,
});

// Interceptor để tự động thêm token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor để handle refresh token khi token hết hạn
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await api.post("/refresh", { refreshToken });
          const { accessToken } = response.data;
          
          localStorage.setItem("accessToken", accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Nếu refresh token cũng hết hạn, logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    role: string;
  };
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
}

export const authApi = {
  // POST /api/auth/login
  login: (email: string, password: string) =>
    api.post<LoginResponse>("/login", { email, password }),

  // POST /api/auth/register
  register: (email: string, password: string, fullName: string) =>
    api.post("/register", { email, password, fullName }),

  // POST /api/auth/refresh
  refreshToken: (refreshToken: string) =>
    api.post<{ accessToken: string }>("/refresh", { refreshToken }),

  // POST /api/auth/logout
  logout: () => api.post("/logout"),

  // GET /api/auth/me
  getCurrentUser: () => api.get<User>("/me"),
};