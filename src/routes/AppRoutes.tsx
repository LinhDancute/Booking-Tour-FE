import { Routes, Route } from "react-router-dom";
import UserLayout from "../components/layout/user/UserLayout";
import AdminRoute from "./AdminRoutes";
import AdminLayout from "../components/layout/admin/AdminLayout";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import TourList from "../features/tour/pages/TourList";
import TourDetail from "../features/tour/pages/TourDetail";
import BookingList from "../features/booking/pages/BookingList";
import BookingDetail from "../features/booking/pages/BookingDetail";
import PaymentPage from "../features/payment/pages/PaymentPage";

import  OverviewPage  from "../features/admin/overview/pages/Overview";
import UserManagementPage  from "../features/admin/managementUsers/pages/UserManagement";
import TourManagementPage  from "../features/admin/manegementTours/pages/TourManagement";
import  BookingManagementPage  from "../features/admin/managementBookings/pages/BookingManagement";
import  ReportsPage  from "../features/admin/managementReports/pages/Reports";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* USER ROUTES */}
      <Route
        path="/"
        element={
          <UserLayout>
            <Home />
          </UserLayout>
        }
      />
      <Route
        path="/about"
        element={
          <UserLayout>
            <About />
          </UserLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <UserLayout>
            <Contact />
          </UserLayout>
        }
      />
      <Route
        path="/login"
        element={
          <UserLayout>
            <LoginPage />
          </UserLayout>
        }
      />
      <Route
        path="/register"
        element={
          <UserLayout>
            <RegisterPage />
          </UserLayout>
        }
      />
      <Route
        path="/tours"
        element={
          <UserLayout>
            <TourList />
          </UserLayout>
        }
      />
      <Route
        path="/tours/:id"
        element={
          <UserLayout>
            <TourDetail />
          </UserLayout>
        }
      />
      <Route
        path="/bookings"
        element={
          <UserLayout>
            <BookingList />
          </UserLayout>
        }
      />
      <Route
        path="/bookings/:id"
        element={
          <UserLayout>
            <BookingDetail />
          </UserLayout>
        }
      />
      <Route
        path="/payment"
        element={
          <UserLayout>
            <PaymentPage />
          </UserLayout>
        }
      />

      {/* ADMIN ROUTES */}
      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        {/* Route mặc định (redirect hoặc overview) */}
        <Route index element={<OverviewPage />} />

        <Route path="overview" element={<OverviewPage />} />
        <Route path="managementUsers" element={<UserManagementPage />} />
        <Route path="managementTours" element={<TourManagementPage />} />
        <Route path="managementBookings" element={<BookingManagementPage />} />
        <Route path="managementReports" element={<ReportsPage />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
