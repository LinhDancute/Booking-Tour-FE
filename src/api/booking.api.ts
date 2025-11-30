import axios from "axios"
import { BOOKING_API_BASE_URL } from "../utils/constants"

const api = axios.create({
  baseURL: `${BOOKING_API_BASE_URL}/api/bookings`,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const bookingApi = {
  // params: { page?: number, limit?: number, search?: string }
  getBookings: (params?: Record<string, any>) => api.get("", { params }),

  getBookingById: (id: string) => api.get(`/${id}`),

  createBooking: (tourId: string, data: any) => api.post("", { tourId, ...data }),

  updateBooking: (id: string, data: any) => api.put(`/${id}`, data),

  cancelBooking: (id: string) => api.delete(`/${id}`),
}
