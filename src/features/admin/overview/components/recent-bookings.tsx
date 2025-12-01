import { useEffect, useState } from "react";
import { bookingApi } from "../../../../api/booking.api";

type RecentBooking = {
  id: string;
  customerName: string;
  tourName: string;
  status: string;
  totalPrice: number;
  createdAt: string;
};

export function RecentBookings() {
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "đã đặt":
        return "bg-green-900/60 text-green-300";
      case "pending":
      case "đang chờ":
        return "bg-yellow-900/60 text-yellow-300";
      case "cancelled":
      case "rejected":
      case "đã hủy":
        return "bg-red-900/60 text-red-300";
      default:
        return "bg-gray-800 text-gray-200";
    }
  };

  useEffect(() => {
    const fetchRecent = async () => {
      setLoading(true);
      try {
        const resp = await bookingApi.getBookings({ page: 1, limit: 5, search: "" });
        const data = resp.data.items ?? resp.data;

        const mapped = data
          .map((b: any) => ({
            id: b.id,
            customerName: b.customerName ?? "-",
            tourName: b.tourName ?? "-",
            status: b.status,
            totalPrice: b.totalPrice,
            createdAt: b.createdAt,
          }))
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setRecentBookings(mapped);
      } catch (err) {
        console.error("Failed to fetch recent bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  if (loading) return <div className="text-gray-200">Đang tải...</div>;

  return (
    <div className="border border-gray-700 p-6 rounded-2xl shadow-lg shadow-black/30 bg-[#2d3643] hover:bg-[#3b4252] transition-colors duration-200 font-sans">
      <h3 className="text-lg font-semibold mb-4 text-gray-100">Đặt chỗ gần đây</h3>
      <div className="space-y-4">
        {recentBookings.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0"
          >
            <div className="space-y-1">
              <p className="font-semibold text-gray-100">{item.customerName}</p>
              <p className="text-sm text-gray-400">{item.tourName}</p>
            </div>
            <div className="text-right space-y-1">
              <span
                className={`${getStatusColor(item.status)} px-2 py-1 rounded-lg text-xs font-medium`}
              >
                {item.status}
              </span>
              <p className="text-sm font-semibold text-gray-200">
                {(item.totalPrice ?? 0).toLocaleString("vi-VN")}₫
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
