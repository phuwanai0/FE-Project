import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  RefreshCw,
} from "lucide-react";

import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/api";

const emptyForm = {
  product_name: "",
  description: "",
  price: "",
  stock: "",
  category_id: "",
};

function getList(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [productData, categoryData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      setProducts(getList(productData, "products"));
      setCategories(getList(categoryData, "categories"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setMessage("");
  }

  function openEditForm(product) {
    setEditingId(product.product_id);

    setForm({
      product_name: product.product_name || "",
      description: product.description || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      category_id: product.category_id ?? "",
    });

    setShowForm(true);
    setMessage("");
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.product_name.trim()) {
      setError("กรุณากรอกชื่อสินค้า");
      return;
    }

    if (
      form.price === "" ||
      Number(form.price) < 0 ||
      form.stock === "" ||
      Number(form.stock) < 0
    ) {
      setError("กรุณากรอกราคาและจำนวนสินค้าให้ถูกต้อง");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const productData = {
        product_name: form.product_name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        category_id: Number(form.category_id),
      };

      if (editingId) {
        await updateProduct(editingId, productData);
        setMessage("แก้ไขสินค้าสำเร็จ");
      } else {
        await createProduct(productData);
        setMessage("เพิ่มสินค้าสำเร็จ");
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);

      await loadData();
    } catch (err) {
      setError(`บันทึกไม่สำเร็จ: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `ต้องการลบสินค้า "${product.product_name}" ใช่หรือไม่?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteProduct(product.product_id);

      setMessage("ลบสินค้าสำเร็จ");
      await loadData();
    } catch (err) {
      setError(`ลบสินค้าไม่สำเร็จ: ${err.message}`);
    }
  }

  const filteredProducts = products.filter((product) =>
    (product.product_name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            จัดการสินค้า
          </h1>
          <p className="text-gray-500 mt-1">
            เพิ่ม แก้ไข และลบสินค้าในร้านขายยา
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadData}
            className="flex items-center gap-2 border bg-white px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw size={18} />
            รีเฟรช
          </button>

          <button
            onClick={openAddForm}
            className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
          >
            <Plus size={18} />
            เพิ่มสินค้า
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="relative mb-5">
          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={20}
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อสินค้า..."
            className="w-full border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {loading ? (
          <p className="text-gray-500 py-6 text-center">
            กำลังโหลดสินค้า...
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">รหัส</th>
                  <th className="p-3">ชื่อสินค้า</th>
                  <th className="p-3">ราคา</th>
                  <th className="p-3">คงเหลือ</th>
                  <th className="p-3">จัดการ</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.product_id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">
                      {product.product_id}
                    </td>

                    <td className="p-3 font-medium">
                      {product.product_name}
                    </td>

                    <td className="p-3">
                      {Number(product.price).toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                      })} บาท
                    </td>

                    <td className="p-3">
                      <span
                        className={
                          Number(product.stock) <= 10
                            ? "text-orange-600 font-semibold"
                            : "text-green-700"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditForm(product)}
                          title="แก้ไข"
                          className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(product)}
                          title="ลบ"
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-8 text-center text-gray-500"
                    >
                      ไม่พบสินค้า
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
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {editingId ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  ชื่อสินค้า
                </label>
                <input
                  name="product_name"
                  value={form.product_name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3"
                  placeholder="เช่น พลาสเตอร์ยา"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">
                  รายละเอียด
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                  rows="3"
                  placeholder="รายละเอียดสินค้า"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    ราคา (บาท)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    จำนวนสินค้า
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    required
                    className="w-full border rounded-lg p-3"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">
                  หมวดหมู่
                </label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3 bg-white"
                >
                  <option value="">เลือกหมวดหมู่</option>

                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2 border rounded-lg"
                >
                  ยกเลิก
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50"
                >
                  {saving ? "กำลังบันทึก..." : "บันทึกสินค้า"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}