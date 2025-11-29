"use client"

import { useState, useEffect } from "react"
import { tourApi } from "../../../../api/tour.api"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"

export const LocationModal = ({ onClose }: { onClose: () => void }) => {
  const [locations, setLocations] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState("")
  const [country, setCountry] = useState("")
  const [province, setProvince] = useState("")
  const [description, setDescription] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10

  const fetchLocations = async () => {
    const res = await tourApi.getLocations()
    setLocations(res.data)
  }

  useEffect(() => { fetchLocations() }, [])

  const openForm = (loc: any = null) => {
    if (loc) {
      setEditing(loc)
      setName(loc.name); setCountry(loc.country); setProvince(loc.province); setDescription(loc.description)
    } else {
      setEditing(null)
      setName(""); setCountry(""); setProvince(""); setDescription("")
    }
    setFormOpen(true)
  }

  const handleSave = async () => {
    if (!name) return alert("Name không được bỏ trống")
    const payload = { name, country, province, description }
    if (editing) {
      await tourApi.updateLocation(editing.locationId, payload)
    } else {
      await tourApi.createLocation(payload)
    }
    setFormOpen(false)
    fetchLocations()
  }

  const handleDelete = async (loc: any) => {
    if (confirm("Bạn có chắc muốn xóa location này?")) {
      await tourApi.deleteLocation(loc.locationId)
      fetchLocations()
    }
  }

  const paginated = locations.slice((page-1)*pageSize, page*pageSize)
  const totalPages = Math.ceil(locations.length / pageSize)

  return (
    <Modal onClose={onClose} title="Quản lý Location" size="lg">
      <div className="flex justify-end mb-4">
        <Button onClick={() => openForm()} className="flex items-center gap-2"><Plus /> Tạo mới</Button>
      </div>

      <table className="w-full table-auto border border-gray-300 text-left rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Country</th>
            <th className="px-4 py-2">Province</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(loc => (
            <tr key={loc.locationId} className="hover:bg-gray-50">
              <td className="px-4 py-2">{loc.name}</td>
              <td className="px-4 py-2">{loc.country}</td>
              <td className="px-4 py-2">{loc.province}</td>
              <td className="px-4 py-2">{loc.description}</td>
              <td className="px-4 py-2 flex gap-2">
                <Button size="sm" onClick={() => openForm(loc)}><Edit /></Button>
                <Button size="sm" variant="destructive" className="text-white bg-red-600 hover:bg-red-700" onClick={() => handleDelete(loc)}><Trash2 /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center gap-2 mt-3">
        <Button disabled={page===1} onClick={()=>setPage(page-1)}>Prev</Button>
        <span className="px-2">Page {page}/{totalPages}</span>
        <Button disabled={page===totalPages} onClick={()=>setPage(page+1)}>Next</Button>
      </div>

      {formOpen && (
        <Modal
          onClose={() => setFormOpen(false)}
          title={editing ? "Chỉnh sửa Location" : "Tạo mới Location"}
          size="md"
        >
          <div className="flex flex-col gap-3">
            <Input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
            <Input placeholder="Country" value={country} onChange={e=>setCountry(e.target.value)} />
            <Input placeholder="Province" value={province} onChange={e=>setProvince(e.target.value)} />
            <Input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
            <div className="flex justify-end gap-2 mt-2">
              <Button onClick={handleSave}>{editing ? "Cập nhật" : "Tạo mới"}</Button>
              <Button variant="secondary" onClick={() => setFormOpen(false)}>Hủy</Button>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  )
}
