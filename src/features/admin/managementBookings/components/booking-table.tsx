import { Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Booking } from "@/src/features/booking/hooks/useBooking";

interface BookingTableProps {
  bookings: Booking[];
  onView?: (booking: Booking) => void;
  onReject?: (booking: Booking) => void;
}

export function BookingTable({ bookings, onView, onReject }: BookingTableProps) {
  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge className="bg-gray-500 text-white">Không rõ</Badge>;

    switch (status.toLowerCase()) {
      case "confirmed":
        return <Badge className="bg-green-600 text-white">Đã xác nhận</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 text-white">Chờ xử lý</Badge>;
      case "cancelled":
        return <Badge className="bg-red-600 text-white">Đã hủy</Badge>;
      case "rejected":
        return <Badge className="bg-red-700 text-white">Bị từ chối</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Không rõ</Badge>;
    }
  };

  return (
    <div className="border border-white/10 shadow-lg shadow-black/40 rounded-lg overflow-hidden mt-10 bg-[#374151] hover:bg-[#3b4252] transition">
      <Table className="w-full">
        <TableHeader className="bg-[#2f3640]/70">
          <TableRow>
            {[
              "Mã đặt",
              "Tên khách hàng",
              "Email",
              "Ngày đặt",
              "Ngày bắt đầu",
              "Ngày kết thúc",
              "Số người",
              "Tổng tiền ($)",
              "Trạng thái",
              "Hành động",
            ].map((head) => (
              <TableHead key={head} className="text-gray-200 font-semibold text-[15px] py-3">
                {head}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {bookings.map((b) => (
            <TableRow key={b.id} className="font-sans text-[15px] text-gray-200 hover:bg-[#4b5563]/50 transition">
              <TableCell>{b.id}</TableCell>
              <TableCell className="font-medium text-white">{b.customerName}</TableCell>
              <TableCell>{b.customerEmail}</TableCell>
              <TableCell>{formatDate(b.bookingDate)}</TableCell>
              <TableCell>{formatDate(b.tourStartDate)}</TableCell>
              <TableCell>{formatDate(b.tourEndDate)}</TableCell>
              <TableCell>{b.numberOfPeople ?? "-"}</TableCell>
              <TableCell>{(b.totalPrice ?? 0).toLocaleString()}</TableCell>
              <TableCell>{getStatusBadge(b.status)}</TableCell>
              <TableCell className="flex gap-2">
                <Eye
                  className="text-blue-400 hover:text-blue-500 cursor-pointer"
                  onClick={() => onView?.(b)}
                />
                <button
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50"
                  hidden={b.status?.toLowerCase() === "rejected"}
                  onClick={() => onReject?.(b)}
                >
                  Từ chối
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
