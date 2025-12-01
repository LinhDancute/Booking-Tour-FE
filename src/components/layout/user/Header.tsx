"use client";

import { Link } from "react-router-dom";
import { useState } from "react";
import "./Header.scss";
import NotificationCenter from ".././user/NotificationCenter";
import { useAuthContext } from "../../../context/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuthContext();
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">✈️</span>
          <span className="logo-text">TourBook</span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
          <Link to="/" className="nav-link">
            Trang chủ
          </Link>
          <Link to="/tours" className="nav-link">
            Tours
          </Link>
          <Link to="/about" className="nav-link">
            Về chúng tôi
          </Link>
          <Link to="/contact" className="nav-link">
            Liên hệ
          </Link>

          <div className="nav-auth">
            {user ? (
              <>
                <NotificationCenter />
                <Link to="/bookings" className="nav-link">
                  Đặt chỗ của tôi
                </Link>
                <button className="btn-logout" onClick={logout}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
