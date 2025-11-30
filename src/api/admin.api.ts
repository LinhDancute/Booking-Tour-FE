import axios from "axios";
import { AUTH_API_BASE_URL } from "../utils/constants";

const api = axios.create({
  baseURL: `${AUTH_API_BASE_URL}/api`,
});

// Interceptor để tự động thêm token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Admin API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  fullName: string;
  role: string;
}

export interface UpdateUserDto {
  fullName?: string;
  role?: string;
  status?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const adminApi = {
  // GET /api/users?page=1&limit=10&search=keyword
  getAllUsers: (page = 1, limit = 10, search = '') =>
    api.get<PaginatedResponse<User>>('/users', {
      params: { page, limit, search }
    }),

  // GET /api/users/:id
  getUserById: (id: number) =>
    api.get<User>(`/users/${id}`),

  // POST /api/users
  createUser: (data: CreateUserDto) =>
    api.post<User>('/users', data),

  // PUT /api/users/:id
  updateUser: (id: number, data: UpdateUserDto) =>
    api.put<User>(`/users/${id}`, data),

  // DELETE /api/users/:id
  deleteUser: (id: number) =>
    api.delete(`/users/${id}`),

  // PUT /api/users/:id/status
  updateUserStatus: (id: number, status: string) =>
    api.put(`/users/${id}/status`, { status }),

  // GET /api/users/search?keyword=abc
  searchUsers: (keyword: string, page = 1, limit = 10) =>
    api.get<PaginatedResponse<User>>('/users/search', {
      params: { keyword, page, limit }
    }),

  // GET /api/users/stats
  getUserStats: () =>
    api.get('/users/stats'),
};