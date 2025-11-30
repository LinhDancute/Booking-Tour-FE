import { useState } from "react"
import { bookingApi } from "../../../api/booking.api"

export interface Booking {
  id: string
  tourId: string
  tourName: string
  tourImage: string
  participants: number
  totalPrice: number
  status: string
  bookingDate: string
  startDate: string
  endDate: string
  customerName: string
  customerEmail: string
  customerPhone: string
}

export function useBooking() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await bookingApi.getBookings()

      if (response.data?.data) {
        setBookings(response.data.data)
      } else {
        setBookings(response.data)
      }

    } catch (err: any) {
      setError(err.message || "Lỗi khi tải bookings")
    } finally {
      setLoading(false)
    }
  }

  const fetchBookingsByUserId = async (userId: string) => {
    if (!userId) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const url = `http://localhost:8082/api/bookings/user/${userId}`;

      const res = await fetch(url)

      if (!res.ok) throw new Error("Không thể tải danh sách booking")

      const data = await res.json()
      setBookings(data)

    } catch (e: any) {
      setError("Không thể tải danh sách booking")
    } finally {
      setLoading(false)
    }
  }

  const getBookingById = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await bookingApi.getBookingById(id)
      return response.data
    } catch (err: any) {
      setError(err.message || "Lỗi khi tải booking")
      return null
    } finally {
      setLoading(false)
    }
  }

  const createBooking = async (tourId: string, data: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await bookingApi.createBooking(tourId, data)
      return { success: true, booking: response.data }
    } catch (err: any) {
      const message = err.response?.data?.message || "Lỗi khi tạo booking"
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const cancelBooking = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8082/api/bookings/${id}/cancel`, {
        method: "PUT"
      })
      if (!res.ok) return { success: false }
      return { success: true }
    } catch {
      return { success: false }
    }
  }

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    fetchBookingsByUserId,
    getBookingById,
    createBooking,
    cancelBooking
  }
}