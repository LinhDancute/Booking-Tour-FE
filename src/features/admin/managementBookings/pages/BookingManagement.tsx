import { useCallback, useEffect, useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { BookingTable } from "../components/booking-table";
import { SearchIcon } from "lucide-react";
import { bookingApi } from "../../../../api/booking.api";

type BookingSummary = {
  id: string;
  userId: string;
  tourId: string;
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  tourStartDate?: string;
  tourEndDate?: string;
  numberOfPeople?: number;
  totalPrice?: number;
  status?: string;
  rejectionReason?: string;
};

export const BookingManagementPage = () => {
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState<BookingSummary | null>(null);
  const [rejectingBooking, setRejectingBooking] = useState<BookingSummary | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const rejectionReasons = [
    "Hủy do quá hạn thanh toán",
    "Thông tin khách không hợp lệ",
    "Tour đã hết chỗ",
    "Khách yêu cầu hủy",
    "Lịch trình trùng với tour khác",
    "Sự kiện bất khả kháng (thiên tai, dịch bệnh)",
    "Khách vi phạm điều khoản đặt tour",
    "Thanh toán không thành công",
    "Tour không còn hoạt động",
    "Khác"
  ];

  const fetchBookings = useCallback(async (p: number, l: number, q: string) => {
    setLoading(true);
    try {
      const resp = await bookingApi.getBookings({ page: p, limit: l, search: q });
      const data = resp.data.items ?? resp.data;
      setTotal(resp.data.total ?? data.length);
      setBookings(
        data.map((b: any) => ({
          id: b.id,
          userId: b.userId,
          tourId: b.tourId,
          customerName: b.customerName ?? "-",
          customerEmail: b.customerEmail ?? "-",
          bookingDate: b.bookingDate ?? b.createdAt,
          tourStartDate: b.tourStartDate,
          tourEndDate: b.tourEndDate,
          numberOfPeople: b.numberOfPeople,
          totalPrice: b.totalPrice,
          status: b.status,
          rejectionReason: b.rejectionReason
        }))
      );
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setBookings([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchBookings(page, limit, search);
  }, [fetchBookings, page, limit, search]);


  const formatDateVN = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return new Intl.DateTimeFormat("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleRejectBooking = async () => {
    if (!rejectingBooking || !rejectReason) return;

    try {
      const url = `http://localhost:8082/api/bookings/${rejectingBooking.id}/reject?reason=${encodeURIComponent(rejectReason)}`;
      const res = await fetch(url, { method: "PUT" });
      if (!res.ok) throw new Error("Không thể từ chối booking");

      setRejectingBooking(null);
      setRejectReason("");
      fetchBookings(page, limit, search);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Lỗi");
    }
  };

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Quản lí Đơn đặt</h1>
        <p className="text-gray-400 italic">Xem thông tin đơn đặt của khách hàng</p>
      </header>

      <div className="flex gap-4 items-center mb-6">
        <InputGroup className="flex-1 max-w-md shadow-lg shadow-black/40 border border-white/10 bg-[#374151] rounded-lg">
          <InputGroupInput
            placeholder="Tìm kiếm khách hàng..."
            className="bg-transparent text-gray-100 placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setPage(1)}
          />
          <InputGroupAddon className="text-gray-300"><SearchIcon /></InputGroupAddon>
        </InputGroup>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">Per page</label>
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            className="bg-[#374151] text-gray-100 border border-white/10 rounded-lg shadow-lg shadow-black/40 px-3 py-2"
          >
            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <BookingTable
        bookings={bookings}
        onView={setSelectedBooking}
        onReject={setRejectingBooking}
      />

      {loading && <div className="text-gray-200 mt-4">Đang tải bookings...</div>}

      <div className="flex items-center justify-between mt-4 text-sm text-gray-300">
        <div>Showing page {page} of {totalPages} — {total} total</div>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 rounded bg-[#374151] text-gray-100 disabled:opacity-50"
          >
            Trước
          </button>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 rounded bg-[#374151] text-gray-100 disabled:opacity-50"
          >
            Tiếp
          </button>

        </div>
      </div>

      {/* View Booking Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-gray-100 p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-2">{selectedBooking.customerName}</h2>
            <p><strong>Email:</strong> {selectedBooking.customerEmail}</p>
            <p><strong>Ngày đặt:</strong> {formatDateVN(selectedBooking.bookingDate)}</p>
            <p><strong>Ngày bắt đầu:</strong> {formatDateVN(selectedBooking.tourStartDate)}</p>
            <p><strong>Ngày kết thúc:</strong> {formatDateVN(selectedBooking.tourEndDate)}</p>
            <p><strong>Số người:</strong> {selectedBooking.numberOfPeople}</p>
            <p><strong>Tổng tiền:</strong> {(selectedBooking.totalPrice ?? 0).toLocaleString("vi-VN")}₫</p>
            <p><strong>Trạng thái:</strong> {selectedBooking.status}</p>
            {selectedBooking.rejectionReason && (
              <p className="mt-2 text-red-400"><strong>Lý do từ chối:</strong> {selectedBooking.rejectionReason}</p>
            )}
            <button onClick={() => setSelectedBooking(null)} className="mt-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700">
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Reject Booking Modal */}
      {rejectingBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-gray-100 p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Từ chối đơn đặt: {rejectingBooking.customerName}</h2>
            <label className="block mb-2">Chọn lý do từ chối:</label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded mb-4"
            >
              <option value="">-- Chọn lý do --</option>
              {rejectionReasons.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700" onClick={() => setRejectingBooking(null)}>
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                disabled={!rejectReason}
                onClick={handleRejectBooking}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
