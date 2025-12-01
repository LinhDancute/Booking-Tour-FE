import { useState } from "react"
import { bookingApi } from "../../../api/booking.api"

export interface Booking {
  id: string
  userId: string
  tourId: string
  customerName: string
  customerEmail: string
  bookingDate: string
  tourStartDate?: string
  tourEndDate?: string
  numberOfPeople?: number
  totalPrice?: number
  status?: string
  rejectionReason?: string
}

export function useBooking() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = async (params?: Record<string, any>) => {
    setLoading(true)
    setError(null)
    try {
      const res = await bookingApi.getBookings(params)
      setBookings(res.data?.data || res.data || [])
    } catch (err: any) {
      setError(err.message || "Lỗi khi tải bookings")
    } finally {
      setLoading(false)
    }
  }

  const getBookingById = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await bookingApi.getBookingById(id)
      return res.data
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
      const res = await bookingApi.createBooking(tourId, data)
      return { success: true, booking: res.data }
    } catch (err: any) {
      const message = err.response?.data?.message || "Lỗi khi tạo booking"
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const cancelBooking = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await bookingApi.cancelBooking(id)
      return { success: res.status >= 200 && res.status < 300 }
    } catch {
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    getBookingById,
    createBooking,
    cancelBooking,
    setBookings,
  }
}
