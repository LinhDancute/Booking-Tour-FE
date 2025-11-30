export const API_BASE_URL = "http://localhost:8080"

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
