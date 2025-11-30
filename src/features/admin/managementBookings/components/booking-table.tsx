import { Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function BookingTable({
  bookings,
}: {
  bookings: Array<{
    id: string
    customerName: string
    customerEmail: string
    bookingDate: string
    tourStartDate?: string
    tourEndDate?: string
    numberOfPeople?: number
    totalPrice?: number
    status?: string
  }>
}) {
  const getStatus = (status: string | undefined) => {
    if (!status) return <Badge className="bg-gray-500 text-white">Không rõ</Badge>;
    const s = status.toString().toLowerCase();
    switch (s) {
      case "confirmed":
        return <Badge className="bg-green-600 text-white">Đã xác nhận</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 text-white">Chờ xử lý</Badge>;
      case "cancelled":
      case "canceled":
        return <Badge className="bg-red-600 text-white">Đã hủy</Badge>;
      case "rejected":
        return <Badge className="bg-red-700 text-white">Bị từ chối</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Không rõ</Badge>;
    }
  };
  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(d);
    } catch (e) {
      return iso;
    }
  };
  return (
    <div className="border border-white/10 shadow-lg shadow-black/40 rounded-lg overflow-hidden mt-10 bg-[#374151] hover:bg-[#3b4252] transition">
      <Table className="w-full">
        {/* Header */}
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
            ].map((head, idx) => (
              <TableHead
                key={idx}
                className="text-gray-200 font-semibold text-[15px] py-3"
              >
                {head}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody>
          {bookings.map((b) => (
            <TableRow
              key={b.id}
              className="font-sans text-[15px] text-gray-200 hover:bg-[#4b5563]/50 transition"
            >
              <TableCell>{b.id}</TableCell>
              <TableCell className="font-medium text-white">
                {b.customerName}
              </TableCell>
              <TableCell>{b.customerEmail}</TableCell>
              <TableCell>{formatDate(b.bookingDate)}</TableCell>
              <TableCell>{formatDate(b.tourStartDate)}</TableCell>
              <TableCell>{formatDate(b.tourEndDate)}</TableCell>
              <TableCell>{b.numberOfPeople ?? "-"}</TableCell>
              <TableCell>{(b.totalPrice ?? 0).toLocaleString()}</TableCell>
              <TableCell>{getStatus(b.status)}</TableCell>
              <TableCell>
                <Eye className="text-blue-400 hover:text-blue-500 cursor-pointer" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
