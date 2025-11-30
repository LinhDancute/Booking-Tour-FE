import axios from "axios";
import { TOUR_API_BASE_URL } from "../utils/constants";

const api = axios.create({
  baseURL: `${TOUR_API_BASE_URL}/api/tours`,
});

export const tourApi = {
  getTours: (page = 1, limit = 10) => api.get("", { params: { page, limit } }),
  getTourById: (id: string) => api.get(`/${id}`),
  searchTours: (query: string, page = 1, limit = 10) => api.get("/search", { params: { q: query, page, limit } }),
  getToursByCategory: (categoryId: string, page = 1, limit = 10) => api.get(`/category/${categoryId}`, { params: { page, limit } }),
  createTour: (data: any) => api.post("", data),
  updateTour: (id: string, data: any) => api.put(`/${id}`, data),
  deleteTour: (id: string) => api.delete(`/${id}`),

  getCategories: () => api.get("/categories"),
  getLocations: () => api.get("/locations"),
  uploadImage: (formData: FormData) => axios.post("http://localhost:8081/api/uploads/image", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }),

  createCategory: (data: any) => api.post("/categories", data),
  updateCategory: (id: number, data: any) => api.put(`/categories/${id}`, data),
  deleteCategory: (id: number) => api.delete(`/categories/${id}`),

  createLocation: (data: any) => api.post("/locations", data),
  updateLocation: (id: number, data: any) => api.put(`/locations/${id}`, data),
  deleteLocation: (id: number) => api.delete(`/locations/${id}`),
};
