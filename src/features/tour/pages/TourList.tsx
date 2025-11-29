"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Button from "../../../components/common/Button"
import { useTour } from "../hooks/useTour"
import { TOUR_CATEGORIES } from "../../../utils/constants"
import { formatCurrency } from "../../../utils/formatCurrency"
import "./TourPages.scss"

export default function TourList() {
  const { tours, loading, error, fetchTours, searchTours } = useTour()
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchTours(selectedCategory);
  }, [selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      searchTours(searchQuery)
    } else {
      fetchTours(1, selectedCategory)
    }
  }

  return (
    <div className="tour-list-page">
      <div className="tour-header">
        <h1>Khám Phá Tours</h1>
        <p>Tìm tour du lịch hoàn hảo cho kỳ nghỉ của bạn</p>
      </div>

      <div className="tour-filters">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Tìm kiếm tour..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <Button type="submit">Tìm Kiếm</Button>
        </form>

        <div className="category-filters">
          <button
            className={`category-btn ${selectedCategory === "" ? "active" : ""}`}
            onClick={() => setSelectedCategory("")}
          >
            Tất cả
          </button>
          {TOUR_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Đang tải tours...</div>
      ) : tours.length === 0 ? (
        <div className="empty-state">
          <p>Không tìm thấy tours nào</p>
        </div>
      ) : (
        <div className="tours-grid">
          {tours.map((tour) => (
              <div key={tour.id} className="tour-card card">
                <div className="tour-image">
                  <img
                    src={tour.image?.startsWith("http") ? tour.image : `http://localhost:8081${tour.image}`}
                    alt={tour.name}
                  />
                  <span className="tour-category">{tour.category}</span>
                </div>

              <div className="tour-content">
                <h3>{tour.name}</h3>
                <p className="tour-location">📍 {tour.location}</p>

                <div className="tour-rating">
                  <span className="stars">⭐ {tour.rating}</span>
                  <span className="reviews">({tour.reviews} đánh giá)</span>
                </div>

                <p className="tour-description">{tour.description}</p>

                <div className="tour-info">
                  <div className="info-item">
                    <span className="label">Thời gian:</span>
                    <span className="value">{tour.duration} ngày</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Người tham gia:</span>
                    <span className="value">
                      {tour.currentParticipants}/{tour.maxParticipants}
                    </span>
                  </div>
                </div>

                <div className="tour-footer">
                  <div className="price">
                    <span className="label">Giá:</span>
                    <span className="amount">{formatCurrency(tour.price)}</span>
                  </div>
                  <Link to={`/tours/${tour.id}`}>
                    <Button size="sm">Chi Tiết</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
