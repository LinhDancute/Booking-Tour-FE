"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Button from "../../../components/common/Button"
import Modal from "../../../components/common/Modal"
import { formatCurrency } from "../../../utils/formatCurrency"
import { formatDate, formatDateTime } from "../../../utils/formatDate"
import { BOOKING_STATUS } from "../../../utils/constants"
import "./BookingPages.scss"

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [canceling, setCanceling] = useState(false)

  useEffect(() => {
    const fetchBookingDetail = async () => {
      if (!id) return
      setLoading(true)
      try {
        const bookingResp = await fetch(`http://localhost:8082/api/bookings/${id}`)
        if (!bookingResp.ok) throw new Error("Không thể lấy thông tin booking")
        const bookingData = await bookingResp.json()

        setBooking({
          ...bookingData,
          participants: bookingData.numberOfPeople,
          startDate: bookingData.tourStartDate,
          endDate: bookingData.tourEndDate,
          totalPrice: bookingData.totalPrice,
          tourName: bookingData.tourName || "Tour chưa có tên",
        })
        setError(null)
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Đã xảy ra lỗi")
      } finally {
        setLoading(false)
      }
    }

    fetchBookingDetail()
  }, [id])

  const handleCancelBooking = async () => {
    if (!id) return
    setCanceling(true)
    try {
      const resp = await fetch(`http://localhost:8082/api/bookings/${id}/cancel`, {
        method: "POST",
      })
      if (!resp.ok) throw new Error("Hủy booking thất bại")
      setShowCancelModal(false)
      navigate("/bookings")
    } catch (err: any) {
      console.error(err)
      alert(err.message || "Đã xảy ra lỗi")
    } finally {
      setCanceling(false)
    }
  }

  const handlePayment = () => {
    navigate("/payment", { state: { bookingId: id } })
  }

  if (loading) return <div className="loading">Đang tải...</div>
  if (error) return <div className="alert alert-error">{error}</div>
  if (!booking) return <div className="alert alert-error">Booking không tìm thấy</div>

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      [BOOKING_STATUS.PENDING]: "pending",
      [BOOKING_STATUS.CONFIRMED]: "confirmed",
      [BOOKING_STATUS.CANCELLED]: "cancelled",
      [BOOKING_STATUS.COMPLETED]: "completed",
    }
    return statusMap[status] || "pending"
  }

  return (
    <div className="booking-detail-page">
      <button className="back-btn" onClick={() => navigate("/bookings")}>
        ← Quay lại
      </button>

      <div className="booking-detail-header">
        <div>
          <h1>{booking.tourName}</h1>
          <p className="booking-id">Mã booking: {booking.id}</p>
        </div>
        <span className={`status-badge status-${getStatusBadge(booking.status)}`}>{booking.status}</span>
      </div>

      <div className="booking-detail-grid">
        <div className="detail-card card">
          <h2>Thông Tin Booking</h2>
          <div className="info-group">
            <div className="info-row">
              <span className="label">Ngày đặt:</span>
              <span className="value">{formatDateTime(booking.bookingDate)}</span>
            </div>
            <div className="info-row">
              <span className="label">Ngày khởi hành:</span>
              <span className="value">{formatDate(booking.startDate)}</span>
            </div>
            <div className="info-row">
              <span className="label">Ngày kết thúc:</span>
              <span className="value">{formatDate(booking.endDate)}</span>
            </div>
            <div className="info-row">
              <span className="label">Số người tham gia:</span>
              <span className="value">{booking.participants} người</span>
            </div>
          </div>
        </div>

        <div className="detail-card card">
          <h2>Chi Tiết Giá</h2>
          <div className="price-breakdown">
            <div className="price-row">
              <span>Giá mỗi người:</span>
              <span>{formatCurrency(booking.totalPrice / booking.participants)}</span>
            </div>
            <div className="price-row">
              <span>Số người:</span>
              <span>x {booking.participants}</span>
            </div>
            <div className="price-row total">
              <span>Tổng cộng:</span>
              <span>{formatCurrency(booking.totalPrice)}</span>
            </div>
          </div>
        </div>

        <div className="detail-card card">
          <h2>Trạng Thái Thanh Toán</h2>
          <div className="payment-status">
            <p className="status-text">
              <span className="status-indicator pending"></span>
              Chưa thanh toán
            </p>
            <p className="amount">{formatCurrency(booking.totalPrice)}</p>
          </div>
        </div>
      </div>

      <div className="booking-actions">
        {booking.status === BOOKING_STATUS.PENDING && (
          <>
            <Button size="lg" onClick={handlePayment}>
              Thanh Toán Ngay
            </Button>
            <Button size="lg" variant="outline" onClick={() => setShowCancelModal(true)}>
              Hủy Booking
            </Button>
          </>
        )}
        {booking.status === BOOKING_STATUS.CONFIRMED && (
          <Button size="lg" onClick={handlePayment}>
            Thanh Toán
          </Button>
        )}
      </div>

      <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} title="Hủy Booking">
        <div className="cancel-modal-content">
          <p>Bạn có chắc chắn muốn hủy booking này?</p>
          <p className="warning">Lưu ý: Chính sách hoàn tiền sẽ được áp dụng theo điều kiện tour.</p>

          <div className="modal-actions">
            <Button variant="outline" onClick={() => setShowCancelModal(false)}>
              Không, Giữ Lại
            </Button>
            <Button variant="danger" loading={canceling} onClick={handleCancelBooking}>
              Có, Hủy Booking
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
