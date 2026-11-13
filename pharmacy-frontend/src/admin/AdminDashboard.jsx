
import { useEffect, useState } from "react";
import { Package, Tags, RefreshCw } from "lucide-react";
import { getProducts, getCategories } from "../services/api";

function getList(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const cards = [
    {
      title: "สินค้าทั้งหมด",
      value: products.length,
      icon: Package,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "หมวดหมู่ทั้งหมด",
      value: categories.length,
      icon: Tags,
      color: "bg-green-100 text-green-700",
    },
  ];

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            ภาพรวมระบบจัดการร้านขายยา
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-2 border bg-white px-4 py-2 rounded-lg"
        >
          <RefreshCw size={18} />
          รีเฟรช
        </button>
      </div>

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-5">
          {error}
        </p>
      )}

      {loading ? (
        <p>กำลังโหลดข้อมูล...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${card.color}`}>
                    <Icon size={28} />
                  </div>

                  <div>
                    <p className="text-gray-500">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {card.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
