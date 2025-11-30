"use client"

import { useState, useEffect } from "react"
import { tourApi } from "../../../../api/tour.api"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"

export const CategoryModal = ({ onClose }: { onClose: () => void }) => {
  const [categories, setCategories] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10

  const fetchCategories = async () => {
    const res = await tourApi.getCategories()
    setCategories(res.data)
  }

  useEffect(() => { fetchCategories() }, [])

  const openForm = (cat: any = null) => {
    if (cat) {
      setEditing(cat)
      setName(cat.name); setDescription(cat.description)
    } else {
      setEditing(null)
      setName(""); setDescription("")
    }
    setFormOpen(true)
  }

  const handleSave = async () => {
    if (!name) return alert("Name không được bỏ trống")
    if (editing) {
      await tourApi.updateCategory(editing.categoryId, { name, description })
    } else {
      await tourApi.createCategory({ name, description })
    }
    setFormOpen(false)
    fetchCategories()
  }

  const handleDelete = async (cat: any) => {
    if (confirm("Bạn có chắc muốn xóa category này?")) {
      await tourApi.deleteCategory(cat.categoryId)
      fetchCategories()
    }
  }

  const paginated = categories.slice((page-1)*pageSize, page*pageSize)
  const totalPages = Math.ceil(categories.length / pageSize)

  return (
    <Modal onClose={onClose} title="Quản lý Category" size="lg">
      <div className="flex justify-end mb-4">
        <Button onClick={() => openForm()} className="flex items-center gap-2"><Plus /> Tạo mới</Button>
      </div>

      <table className="w-full table-auto border border-gray-300 text-left rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(cat => (
            <tr key={cat.categoryId} className="hover:bg-gray-50">
              <td className="px-4 py-2">{cat.name}</td>
              <td className="px-4 py-2">{cat.description}</td>
              <td className="px-4 py-2 flex gap-2">
                <Button size="sm" onClick={() => openForm(cat)}><Edit /></Button>
                <Button size="sm" variant="destructive" className="text-white bg-red-600 hover:bg-red-700" onClick={() => handleDelete(cat)}>
                  <Trash2 />
                </Button>
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
          title={editing ? "Chỉnh sửa Category" : "Tạo mới Category"}
          size="md"
        >
          <div className="flex flex-col gap-3">
            <Input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
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
