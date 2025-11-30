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
    tourDate?: string
    numberOfPeople?: number
    totalPrice?: number
    status?: string
  }>
}) {
  const getStatus = (status: string | undefined) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-600 text-white">Đã xác nhận</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 text-white">Chờ xử lý</Badge>;
      case "cancelled":
        return <Badge className="bg-red-600 text-white">Đã hủy</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Không rõ</Badge>;
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
              "Ngày tham gia",
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
              <TableCell>{b.bookingDate}</TableCell>
              <TableCell>{b.tourDate || "-"}</TableCell>
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
