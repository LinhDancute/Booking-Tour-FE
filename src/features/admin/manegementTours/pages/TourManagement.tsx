"use client"

import { useState, useEffect } from "react"
import { tourApi } from "../../../api/tour.api"
import { useTour } from "../../../tour/hooks/useTour"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { SearchIcon } from "lucide-react"
import { TourTable } from "../components/tour-table"
import { TourModal } from "../components/tour-modal"
import { CategoryModal } from "../components/category-modal"
import { LocationModal } from "../components/location-modal"

export const TourManagementPage = () => {
  const { tours, fetchTours, searchTours } = useTour()
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
//   const [editingTour, setEditingTour] = useState<Tour | null>(null)
  const [showCategories, setShowCategories] = useState(false)
  const [showLocations, setShowLocations] = useState(false)

  useEffect(() => {
    fetchTours(); // admin lấy tất cả
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    searchTours(e.target.value); // dùng cùng hook
  };

  const handleCreate = () => {
//     setEditingTour(null)
    setIsModalOpen(true)
  }

//   const handleEdit = (tour: Tour) => {
//     setEditingTour(tour)
//     setIsModalOpen(true)
//   }

  return (
      <>
        <header className="mb-3 flex justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-100 mb-2">
              Quản lí Tour
            </h1>
            <p className="text-gray-400 italic font-serif">
              Tạo và cập nhật các gói tour
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setShowCategories(true)}>Xem Category</Button>
            <Button onClick={() => setShowLocations(true)}>Xem Location</Button>
            <Button
              className="w-32 bg-[#374151] hover:bg-[#51607a] flex items-center justify-start gap-3"
              onClick={handleCreate}
            >
              <Plus /> <span className="text-center">Tạo Tour</span>
            </Button>
          </div>
        </header>

        <div className="mb-5">
          <InputGroup className="flex-1 max-w-md shadow-lg shadow-black/40 border border-white/10 bg-[#374151] rounded-lg">
            <InputGroupInput
              placeholder="Tìm kiếm tour..."
              className="bg-transparent text-gray-100 placeholder-gray-400"
              value={search}
              onChange={handleSearch}
            />
            <InputGroupAddon className="text-gray-300">
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <TourTable tours={tours} fetchTours={fetchTours} />

        {isModalOpen && (
          <TourModal
            tour={null}
            mode="create"
            onClose={() => setIsModalOpen(false)}
            onSaved={() => {
              setIsModalOpen(false)
              fetchTours()
            }}
          />
        )}
         {showCategories && <CategoryModal onClose={() => setShowCategories(false)} />}
         {showLocations && <LocationModal onClose={() => setShowLocations(false)} />}
      </>
    )
}
