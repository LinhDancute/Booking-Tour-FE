import { useState } from "react"
import { Pencil, Trash } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tour } from "../../../hooks/useTour"
import { TourModal } from "./tour-modal"
import { tourApi } from "../../../../api/tour.api"

interface TourTableProps {
  tours: Tour[]
  fetchTours: () => void
}

export function TourTable({ tours, fetchTours }: TourTableProps) {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)
  const [mode, setMode] = useState<"view" | "edit" | "create">("view")

  const getStatus = (status: boolean) => status ? (
    <Badge className="bg-green-400/20 text-green-300 border border-green-500/40 font-medium px-2 py-1 rounded-md">Active</Badge>
  ) : (
    <Badge className="bg-red-400/20 text-red-300 border border-red-500/40 font-medium px-2 py-1 rounded-md">Sold out</Badge>
  )

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa tour này?")) return
    try {
      await tourApi.deleteTour(id)
      fetchTours()
    } catch (err: any) {
      alert(err.message || "Lỗi khi xóa tour")
    }
  }

  return (
      <>
        <div className="border border-white/10 shadow-lg shadow-black/40 rounded-lg overflow-hidden mt-10 bg-[#374151]">
          <Table className="w-full">
            <TableHeader className="bg-[#2f3640]/80">
              <TableRow>
                {["Tour", "Name", "Location", "Duration", "Price", "Status", "Actions"].map((head, idx) => (
                  <TableHead key={idx} className="text-gray-100 font-semibold text-[16px] uppercase tracking-wide py-3">{head}</TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {tours.map((tour) => (
                <TableRow
                  key={tour.id}
                  className="font-serif text-[15px] text-gray-200 hover:bg-[#4b5563]/50 transition cursor-pointer"
                  onClick={() => {
                    setSelectedTour(tour)
                    setMode("view")
                  }}
                >
                  <TableCell>
                    <img
                      src={tour.image?.startsWith("http") ? tour.image : `http://localhost:8081${tour.image}`}
                      alt={tour.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                  </TableCell>

                  <TableCell className="font-medium text-white">{tour.name}</TableCell>
                  <TableCell>{tour.location}</TableCell>
                  <TableCell>{tour.duration} ngày</TableCell>
                  <TableCell className="text-yellow-300 font-semibold">${tour.price}</TableCell>
                  <TableCell>{getStatus(tour.currentParticipants < tour.maxParticipants)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-gray-300">
                      <Pencil
                        className="hover:text-white cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedTour(tour)
                          setMode("edit")
                        }}
                      />
                      <Trash
                        className="hover:text-white cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(tour.id)
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {selectedTour && (
          <TourModal
            tour={selectedTour}
            mode={mode}
            onClose={() => setSelectedTour(null)}
            onSaved={() => {
              setSelectedTour(null)
              fetchTours()
            }}
          />
        )}
      </>
    )
}
