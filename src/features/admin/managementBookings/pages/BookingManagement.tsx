import { useEffect, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { BookingTable } from "../components/booking-table";
import { SearchIcon } from "lucide-react";
import { bookingApi } from "../../../../api/booking.api";
import { userApi } from "../../../../api/user.api";

type BookingSummary = {
  id: string;
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  tourStartDate?: string;
  numberOfPeople?: number;
  totalPrice?: number;
  status?: string;
};

type UserProfile = {
  id: number;
  email: string;
  fullName: string;
  roles: string[];
};

export const BookingManagementPage = () => {
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [userCache, setUserCache] = useState<Map<string | number, UserProfile>>(new Map());

  // Fetch user by ID with caching
  const fetchUserByIdCached = async (userId: string | number) => {
    if (userCache.has(userId)) {
      return userCache.get(userId);
    }
    try {
      const resp = await userApi.getUserById(userId);
      const userData = resp.data;
      setUserCache((prev) => new Map(prev).set(userId, userData));
      return userData;
    } catch (err) {
      console.error(`Failed to fetch user ${userId}:`, err);
      return null;
    }
  };

  const fetchBookings = async (p = page, l = limit, q = search) => {
    setLoading(true);
    try {
      const resp = await bookingApi.getBookings({ page: p, limit: l, search: q });
      // Try common pagination shapes: {data: {items, total}} or {data: items}
      const data = resp.data;
      let bookingList: any[] = [];
      if (data && data.items) {
        bookingList = data.items;
        setTotal(data.total || data.totalCount || 0);
      } else if (Array.isArray(data)) {
        bookingList = data;
        setTotal(data.length);
      } else if (data && data.data) {
        bookingList = data.data.items || data.data || [];
        setTotal(data.data.total || data.data.totalCount || 0);
      } else {
        bookingList = [];
        setTotal(0);
      }

      // Enrich bookings with user data
      const enrichedBookings = await Promise.all(
        bookingList.map(async (booking: any) => {
          let customerName = "N/A";
          let customerEmail = "N/A";

          if (booking.userId) {
            const user = await fetchUserByIdCached(booking.userId);
            if (user) {
              customerName = user.fullName || user.email || "N/A";
              customerEmail = user.email || "N/A";
            }
          }

          return {
            id: booking.id,
            customerName,
            customerEmail,
            bookingDate: booking.bookingDate || booking.createdAt,
            tourStartDate: booking.tourStartDate,
            numberOfPeople: booking.numberOfPeople,
            totalPrice: booking.totalPrice,
            status: booking.status,
          };
        })
      );

      setBookings(enrichedBookings);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setBookings([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(1, limit, "");
  }, []);

  useEffect(() => {
    fetchBookings(page, limit, search);
  }, [page, limit]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-100 mb-2">
          Quản lí Đơn đặt
        </h1>
        <p className="text-gray-400 italic font-serif">
          Xem thông tin đơn đặt của khách hàng
        </p>
      </header>

      {/* Search + Paging controls */}
      <div className="flex gap-4 items-center">
        <InputGroup className="flex-1 max-w-md shadow-lg shadow-black/40 border border-white/10 bg-[#374151] rounded-lg">
          <InputGroupInput
            placeholder="Tìm kiếm khách hàng..."
            className="bg-transparent text-gray-100 placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                fetchBookings(1, limit, search);
              }
            }}
          />
          <InputGroupAddon className="text-gray-300">
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">Per page</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="bg-[#374151] text-gray-100 border border-white/10 rounded-lg shadow-lg shadow-black/40 px-3 py-2"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Booking Table */}
      <div className="mt-6">
        <BookingTable bookings={bookings} />

        {/* Simple pagination controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-300">
            Showing page {page} of {totalPages} — {total} total
          </div>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded bg-[#374151] text-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded bg-[#374151] text-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
