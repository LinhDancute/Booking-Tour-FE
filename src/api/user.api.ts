import axios from "axios"
import { AUTH_API_BASE_URL } from "../utils/constants"

const api = axios.create({
  baseURL: `${AUTH_API_BASE_URL}/api`,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const userApi = {
  getUserById: (id: string | number) => api.get(`/users/${id}`),
  
  getUsers: (params?: Record<string, any>) => api.get("/users", { params }),
}
