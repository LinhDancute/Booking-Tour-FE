import { DollarSign, Map, Calendar, Users } from "lucide-react";
import { RecentBookings } from "../components/recent-bookings";
import { PopularTour } from "../components/popular-tour";

export default function OverviewPage() {
  const cards = [
    {
      id: "1",
      title: "Tổng Doanh thu",
      quantity: "$14,493",
      increase: "+12% so với tháng trước",
      icon: <DollarSign />,
      iconColor: "text-blue-400",
    },
    {
      id: "2",
      title: "Tổng số lượt đặt chỗ",
      quantity: "3",
      increase: "+8 lượt so với tháng trước",
      icon: <Calendar />,
      iconColor: "text-emerald-400",
    },
    {
      id: "3",
      title: "Tours hoạt động",
      quantity: "5",
      increase: "6 tour hoạt động",
      icon: <Map />,
      iconColor: "text-yellow-400",
    },
    {
      id: "4",
      title: "Tổng số khách hàng",
      quantity: "5",
      increase: "+5 so với tháng trước",
      icon: <Users />,
      iconColor: "text-pink-400",
    },
  ];

  return (
    <div className="font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-100 mb-2">
          Chào mừng quay trở lại, Admin 
        </h1>
        <p className="text-gray-400 italic font-serif">
          Đây là tổng quan thống kê tours trong ngày.
        </p>
      </header>

      {/* Cards */}
      <div className="flex flex-wrap gap-6 mt-5">
        {cards.map((card) => (
          <div
            key={card.id}
            className="border border-gray-700 px-6 py-5 w-[320px] rounded-2xl flex gap-4 items-center justify-between shadow-md bg-[#2d3643] hover:bg-[#3b4252] transition-colors duration-200"
          >
            <div className="flex flex-col">
              <p className="text-gray-300 text-base font-medium">
                {card.title}
              </p>
              <h3 className="font-bold text-3xl text-gray-100 mt-1">
                {card.quantity}
              </h3>
              <span className="italic text-sm text-green-400 mt-1">
                {card.increase}
              </span>
            </div>
            <div
              className={`p-3 rounded-lg bg-blue-500/10 ${card.iconColor}`}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentBookings />
        <PopularTour />
      </div>
    </div>
  );
};
