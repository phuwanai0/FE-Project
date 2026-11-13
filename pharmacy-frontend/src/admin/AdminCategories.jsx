
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, RefreshCw } from "lucide-react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/api";

function getList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.categories)) return data.categories;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const data = await getCategories();
      setCategories(getList(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function openAdd() {
    setName("");
    setEditingId(null);
    setShowForm(true);
    setError("");
    setMessage("");
  }

  function openEdit(category) {
    setName(category.category_name || "");
    setEditingId(category.category_id);
    setShowForm(true);
    setError("");
    setMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      setError("กรุณากรอกชื่อหมวดหมู่");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const data = {
        category_name: name.trim(),
      };

      if (editingId !== null) {
        await updateCategory(editingId, data);
        setMessage("แก้ไขหมวดหมู่สำเร็จ");
      } else {
        await createCategory(data);
        setMessage("เพิ่มหมวดหมู่สำเร็จ");
      }

      setShowForm(false);
      setName("");
      setEditingId(null);

      await loadCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category) {
    const confirmed = window.confirm(
      `ต้องการลบหมวดหมู่ "${category.category_name}" หรือไม่?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteCategory(category.category_id);
      setMessage("ลบหมวดหมู่สำเร็จ");

      await loadCategories();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            จัดการหมวดหมู่
          </h1>
          <p className="text-gray-500 mt-1">
            เพิ่ม แก้ไข และลบหมวดหมู่สินค้า
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadCategories}
            className="flex items-center gap-2 border bg-white px-4 py-2 rounded-lg"
          >
            <RefreshCw size={18} />
            รีเฟรช
          </button>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={18} />
            เพิ่มหมวดหมู่
          </button>
        </div>
      </div>

      {message && (
        <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
          {message}
        </p>
      )}

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </p>
      )}

      <div className="bg-white rounded-xl shadow-sm p-5">
        {loading ? (
          <p className="text-center py-6">กำลังโหลด...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3">รหัส</th>
                  <th className="p-3">ชื่อหมวดหมู่</th>
                  <th className="p-3">จัดการ</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category.category_id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">{category.category_id}</td>
                    <td className="p-3 font-medium">
                      {category.category_name}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(category)}
                          className="p-2 bg-blue-100 text-blue-700 rounded-lg"
                          title="แก้ไข"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(category)}
                          className="p-2 bg-red-100 text-red-700 rounded-lg"
                          title="ลบ"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {categories.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-500">
                      ยังไม่มีหมวดหมู่
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">
                {editingId !== null ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่"}
              </h2>

              <button onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label className="block mb-2 text-sm font-medium">
                ชื่อหมวดหมู่
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg p-3 mb-5"
                placeholder="เช่น ยาสามัญประจำบ้าน"
                required
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border px-4 py-2 rounded-lg"
                >
                  ยกเลิก
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-green-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                >
                  {saving ? "กำลังบันทึก..." : "บันทึก"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
