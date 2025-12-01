import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Button from "../../../components/common/Button"
import { useBooking } from "../hooks/useBooking"
import { formatCurrency } from "../../../utils/formatCurrency"
import { formatDate } from "../../../utils/formatDate"
import { BOOKING_STATUS } from "../../../utils/constants"
import "./BookingPages.scss"

export default function BookingList() {
  const { bookings, loading, error, fetchBookingsByUserId, cancelBooking } = useBooking()
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [cancelingId, setCancelingId] = useState<string | null>(null)
  const validStatuses = [
    BOOKING_STATUS.PENDING,
    BOOKING_STATUS.CONFIRMED,
    BOOKING_STATUS.CANCELLED,
    BOOKING_STATUS.REJECTED,
  ];

  const countByStatus = (status: string) =>
    bookings.filter((b) => b.status === status).length

  const totalValidBookings = () =>
    validStatuses.reduce((sum, status) => sum + countByStatus(status), 0);

  console.log("Bookings:", totalValidBookings());

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      return;
    }

    if (!JSON.parse(userStr)?.id) {
      return;
    }

    fetchBookingsByUserId(JSON.parse(userStr)?.id.toString());
  }, [])

  const handleCancelBooking = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy booking này?")) {
      setCancelingId(id)
      const res = await cancelBooking(id)
      setCancelingId(null)

      if (res.success) {
        const userStr = localStorage.getItem("user")
        if (userStr) {
          try {
            const userId = JSON.parse(userStr)?.id;
            if (userId) {
              fetchBookingsByUserId(userId.toString())
            }
          } catch (error) {
            console.error("Error parsing user:", error);
          }
        }
      }
    }
  }

  const filteredBookings = selectedStatus
    ? bookings.filter((b) => b.status === selectedStatus)
    : bookings

  const getStatusBadge = (status: string) => {
    const mapStatus: any = {
      PENDING: "pending",
      CONFIRMED: "confirmed",
      CANCELLED: "cancelled",
      COMPLETED: "completed",
    }
    return mapStatus[status] || "pending"
  }

  return (
    <div className="booking-list-page">
      <div className="booking-header">
        <h1>Đặt Chỗ Của Tôi</h1>
        <p>Quản lý tất cả các booking tour của bạn</p>
      </div>

      <div className="booking-filters">
        <button
          onClick={() => setSelectedStatus("")}
          className={`status-btn ${selectedStatus === "" ? "active" : ""}`}
        >
          Tất cả ({totalValidBookings()})
        </button>


        <button
          onClick={() => setSelectedStatus(BOOKING_STATUS.PENDING)}
          className={`status-btn ${selectedStatus === BOOKING_STATUS.PENDING ? "active" : ""}`}
        >
          Chờ xác nhận ({countByStatus(BOOKING_STATUS.PENDING)})
        </button>

        <button
          onClick={() => setSelectedStatus(BOOKING_STATUS.CONFIRMED)}
          className={`status-btn ${selectedStatus === BOOKING_STATUS.CONFIRMED ? "active" : ""}`}
        >
          Đã xác nhận ({countByStatus(BOOKING_STATUS.CONFIRMED)})
        </button>

        <button
          onClick={() => setSelectedStatus(BOOKING_STATUS.CANCELLED)}
          className={`status-btn ${selectedStatus === BOOKING_STATUS.CANCELLED ? "active" : ""}`}
        >
          Đã hủy ({countByStatus(BOOKING_STATUS.CANCELLED)})
        </button>

        <button
          onClick={() => setSelectedStatus(BOOKING_STATUS.REJECTED)}
          className={`status-btn ${selectedStatus === BOOKING_STATUS.REJECTED ? "active" : ""}`}
        >
          Bị từ chối ({countByStatus(BOOKING_STATUS.REJECTED)})
        </button>

      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Đang tải bookings...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="empty-state">
          <p>Bạn chưa có booking nào</p>
          <Link to="/tours">
            <Button>Xem Tours</Button>
          </Link>
        </div>
      ) : (
        <div className="bookings-list">
          {filteredBookings.map((booking: any) => (
            <div key={booking.id} className="booking-card card">
              <div className="booking-image">
                <img src={booking.tourImage || "/placeholder.svg"} alt={booking.tourName} />
              </div>

              <div className="booking-content">
                <div className="booking-header-info">
                  <div>
                    <h3>{booking.tourName}</h3>
                    <p className="booking-date">Đặt ngày: {formatDate(booking.bookingDate)}</p>
                  </div>

                  <span className={`status-badge status-${getStatusBadge(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="detail-item">
                    <span className="label">Số người:</span>
                    <span className="value">{booking.numberOfPeople} người</span>
                  </div>

                  <div className="detail-item">
                    <span className="label">Ngày khởi hành:</span>
                    <span className="value">{formatDate(booking.tourStartDate)}</span>
                  </div>

                  <div className="detail-item">
                    <span className="label">Ngày kết thúc:</span>
                    <span className="value">{formatDate(booking.tourEndDate)}</span>
                  </div>
                </div>

                <div className="booking-footer">
                  <div className="price">
                    <span className="label">Tổng cộng:</span>
                    <span className="amount">{formatCurrency(booking.totalPrice)}</span>
                  </div>

                  <div className="actions">
                    <Link to={`/bookings/${booking.id}`}>
                      <Button size="sm" variant="outline">
                        Chi Tiết
                      </Button>
                    </Link>

                    {booking.status === BOOKING_STATUS.PENDING && (
                      <Button
                        size="sm"
                        variant="danger"
                        loading={cancelingId === booking.id}
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Hủy
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
