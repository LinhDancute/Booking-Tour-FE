// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081"
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081"
export const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL || "http://localhost:6060"
export const TOUR_API_BASE_URL = import.meta.env.VITE_TOUR_API_BASE_URL || "http://localhost:8081"


export const TOUR_CATEGORIES = [
  { id: 1, name: "Biển" },
  { id: 2, name: "Núi" },
  { id: 3, name: "Thành phố" },
  { id: 4, name: "Văn hóa" },
  { id: 5, name: "Phiêu lưu" },
]

export const BOOKING_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
}

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
}
