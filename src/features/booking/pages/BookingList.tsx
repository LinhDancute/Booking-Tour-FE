import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/common/Button";
import { useBooking } from "../hooks/useBooking";
import { useTour } from "../../tour/hooks/useTour";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import { BOOKING_STATUS } from "../../../utils/constants";
import "./BookingPages.scss";

export default function BookingList() {
  const { bookings, loading, error, fetchBookings, cancelBooking } = useBooking();
  const { tours, fetchTours } = useTour();

  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const validStatuses = [
    BOOKING_STATUS.PENDING,
    BOOKING_STATUS.CONFIRMED,
    BOOKING_STATUS.CANCELLED,
    BOOKING_STATUS.REJECTED,
  ];

  const countByStatus = (status: string) =>
    bookings.filter((b) => b.status === status).length;

  const totalValidBookings = validStatuses.reduce(
    (sum, status) => sum + countByStatus(status),
    0
  );

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const userId = userStr && JSON.parse(userStr)?.id?.toString();
    if (!userId) return;

    fetchBookings({ userId });
    fetchTours();
  }, []);

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy booking này?")) return;

    setCancelingId(id);
    const res = await cancelBooking(id);
    setCancelingId(null);

    if (res.success) {
      const userStr = localStorage.getItem("user");
      const userId = userStr && JSON.parse(userStr)?.id?.toString();
      if (userId) fetchBookings({ userId });
    }
  };

  const bookingsWithTour = useMemo(() => {
    if (!tours?.length) return bookings.map(b => ({ ...b, tourName: "-", tourImage: "/placeholder.svg" }));

    return bookings.map((b) => {
      const tour = tours.find((t) => t.id.toString() === b.tourId?.toString());

      return {
        ...b,
        tourName: tour?.name ?? "-",
        tourImage: tour?.image ?? "/placeholder.svg",
      };
    });
  }, [bookings, tours]);

  const filteredBookings = selectedStatus
    ? bookingsWithTour.filter((b) => b.status === selectedStatus)
    : bookingsWithTour;

  const getStatusBadge = (status: string) => {
    const mapStatus: Record<string, string> = {
      PENDING: "pending",
      CONFIRMED: "confirmed",
      CANCELLED: "cancelled",
      REJECTED: "rejected",
      COMPLETED: "completed",
    };
    return mapStatus[status] || "pending";
  };

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
          Tất cả ({totalValidBookings})
        </button>

        {validStatuses.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`status-btn ${selectedStatus === status ? "active" : ""}`}
          >
            {status === BOOKING_STATUS.PENDING && `Chờ thanh toán (${countByStatus(status)})`}
            {status === BOOKING_STATUS.CONFIRMED && `Đã thanh toán (${countByStatus(status)})`}
            {status === BOOKING_STATUS.CANCELLED && `Đã hủy (${countByStatus(status)})`}
            {status === BOOKING_STATUS.REJECTED && `Bị từ chối (${countByStatus(status)})`}
          </button>
        ))}
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
                      <Button size="sm" variant="outline">Chi Tiết</Button>
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
  );
}