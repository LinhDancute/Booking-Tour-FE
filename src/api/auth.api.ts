import axios from "axios";
import { AUTH_API_BASE_URL } from "../utils/constants"

const api = axios.create({
  baseURL: `${AUTH_API_BASE_URL}/api/auth`,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/login", { email, password }),

  register: (email: string, password: string, fullName: string) =>
    api.post("/register", { email, password, fullName }),

  logout: () => api.post("/logout"),

  getCurrentUser: () => api.get("/me"),
};
