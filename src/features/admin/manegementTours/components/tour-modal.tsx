"use client"
import { useState, useEffect } from "react"
import { tourApi } from "../../../../api/tour.api"
import { Button } from "@/components/ui/button"

interface TourModalProps {
  tour: any | null
  onClose: () => void
  onSaved: () => void
  mode?: "view" | "edit" | "create"
}

interface Category {
  categoryId: number
  name: string
}

interface Location {
  locationId: number
  name: string
}

export function TourModal({ tour, onClose, onSaved, mode = "create" }: TourModalProps) {
  const [form, setForm] = useState<any>({
    name: "",
    description: "",
    price: 0,
    image: "",
    rating: 0,
    reviewCount: 0,
    startDate: "",
    endDate: "",
    durationDays: 1,
    maxPeople: 1,
    availableSlots: 0,
    categoryId: 0,
    locationId: 0,
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const isReadOnly = mode === "view"

  // Load category & location
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await tourApi.getCategories()
        setCategories(catRes.data || [])
        const locRes = await tourApi.getLocations()
        setLocations(locRes.data || [])
      } catch (err: any) {
        alert(err.message || "Lỗi khi tải Category/Location")
      }
    }
    fetchData()
  }, [])

  // Fill form khi chỉnh sửa
  useEffect(() => {
    if (tour) {
      setForm((prev: any) => ({
        ...prev,
        name: tour.name || "",
        description: tour.description || "",
        price: tour.price || 0,
        image: tour.image || "",
        rating: tour.rating || 0,
        reviewCount: tour.reviews || 0,
        startDate: tour.startDate || "",
        endDate: tour.endDate || "",
        durationDays: tour.duration || 1,
        maxPeople: tour.maxParticipants || 1,
        availableSlots: tour.currentParticipants || 0,
        categoryId:
          categories.find((c) => c.name === tour.category)?.categoryId || 0,
        locationId:
          locations.find((l) => l.name === tour.location)?.locationId || 0,
      }))
    } else {
      setForm((prev) => ({ ...prev, categoryId: 0, locationId: 0 }))
    }
  }, [tour, categories, locations])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (isReadOnly) return
        const { name, value } = e.target
        setForm((prev: any) => ({
          ...prev,
          [name]: ["price", "rating", "reviewCount", "durationDays", "maxPeople", "availableSlots", "categoryId", "locationId"].includes(name)
            ? Number(value)
            : value
        }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await tourApi.uploadImage(formData);
      setForm((prev: any) => ({ ...prev, image: res.data }));
    } catch (err: any) {
      alert(err.message || "Upload ảnh thất bại");
    }
  };


  const handleSubmit = async () => {
    if (isReadOnly) return
    setLoading(true)
    try {
      if (tour && mode === "edit") {
        await tourApi.updateTour(tour.id, form)
      } else {
        await tourApi.createTour(form)
      }
      onSaved()
      onClose()
    } catch (err: any) {
      alert(err.message || "Lỗi khi lưu tour")
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#1f2937] p-6 rounded-lg w-full max-w-2xl shadow-lg overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl font-bold mb-4 text-white">
            {mode === "view" ? "Xem chi tiết Tour" : mode === "edit" ? "Cập nhật Tour" : "Tạo Tour"}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="text-gray-300">Tên tour</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                readOnly={isReadOnly}
                className={`w-full p-2 rounded bg-gray-700 text-white ${isReadOnly ? "opacity-70 cursor-not-allowed" : ""}`}
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-gray-300">Địa điểm</label>
              <select
                name="locationId"
                value={form.locationId}
                onChange={handleChange}
                disabled={isReadOnly}
                className={`w-full p-2 rounded bg-gray-700 text-white ${isReadOnly ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                <option value={0}>Chọn địa điểm</option>
                {locations.map((loc) => (
                  <option key={loc.locationId} value={loc.locationId}>{loc.name}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="text-gray-300">Giá</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                readOnly={isReadOnly}
                className={`w-full p-2 rounded bg-gray-700 text-white ${isReadOnly ? "opacity-70 cursor-not-allowed" : ""}`}
              />
            </div>

            {/* Duration */}
            <div>
              <label className="text-gray-300">Số ngày</label>
              <input
                name="durationDays"
                type="number"
                value={form.durationDays}
                onChange={handleChange}
                readOnly={isReadOnly}
                className={`w-full p-2 rounded bg-gray-700 text-white ${isReadOnly ? "opacity-70 cursor-not-allowed" : ""}`}
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-gray-300">Category</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                disabled={isReadOnly}
                className={`w-full p-2 rounded bg-gray-700 text-white ${isReadOnly ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                <option value={0}>Chọn category</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Image */}
            <div>
              <label className="text-gray-300">Hình ảnh</label>
              {!isReadOnly && <input type="file" onChange={handleImageUpload} className="w-full text-white" />}
              {form.image && (
                <img
                  src={form.image.startsWith("http") ? form.image : `http://localhost:8081${form.image}`}
                  alt="tour"
                  className="mt-2 w-full h-40 object-cover rounded"
                />
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="text-gray-300">Đánh giá (Rating)</label>
              <input
                name="rating"
                type="number"
                step="0.1"
                value={form.rating}
                onChange={handleChange}
                readOnly={isReadOnly}
                className={`w-full p-2 rounded bg-gray-700 text-white ${isReadOnly ? "opacity-70 cursor-not-allowed" : ""}`}
              />
            </div>

            {/* Review Count */}
            <div>
              <label className="text-gray-300">Số lượt đánh giá</label>
              <input
                name="reviewCount"
                type="number"
                value={form.reviewCount}
                onChange={handleChange}
                readOnly={isReadOnly}
                className={`w-full p-2 rounded bg-gray-700 text-white ${isReadOnly ? "opacity-70 cursor-not-allowed" : ""}`}
              />
            </div>

            {/* Available Slots */}
            <div>
              <label className="text-gray-300">Chỗ còn trống</label>
              <input
                name="availableSlots"
                type="number"
                value={form.availableSlots}
                onChange={handleChange}
                readOnly={isReadOnly}
                className={`w-full p-2 rounded bg-gray-700 text-white ${isReadOnly ? "opacity-70 cursor-not-allowed" : ""}`}
              />
            </div>

            {/* Start/End Date */}
            <div>
              <label className="text-gray-300">Ngày bắt đầu</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                readOnly={isReadOnly}
                className={`w-full p-2 rounded bg-gray-700 text-white ${isReadOnly ? "opacity-70 cursor-not-allowed" : ""}`}
              />
            </div>

            <div>
              <label className="text-gray-300">Ngày kết thúc</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                readOnly={isReadOnly}
                className={`w-full p-2 rounded bg-gray-700 text-white ${isReadOnly ? "opacity-70 cursor-not-allowed" : ""}`}
              />
            </div>

            {/* Max participants */}
            <div>
              <label className="text-gray-300">Số lượng tối đa</label>
              <input
                name="maxPeople"
                type="number"
                value={form.maxPeople}
                onChange={handleChange}
                readOnly={isReadOnly}
                className={`w-full p-2 rounded bg-gray-700 text-white ${isReadOnly ? "opacity-70 cursor-not-allowed" : ""}`}
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="text-gray-300">Mô tả</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                readOnly={isReadOnly}
                className={`w-full p-2 rounded bg-gray-700 text-white ${isReadOnly ? "opacity-70 cursor-not-allowed" : ""}`}
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={onClose} className="bg-gray-600 hover:bg-gray-700">Đóng</Button>
            {!isReadOnly && (
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {mode === "edit" ? "Cập nhật" : "Tạo"}
              </Button>
            )}
          </div>
        </div>
      </div>
    )
}