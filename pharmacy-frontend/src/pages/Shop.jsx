
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  ImageOff,
  Package,
  Pill,
  HeartPulse,
  X,
  RefreshCw,
} from "lucide-react";

import { getProducts, addCartItem } from "../services/api";

// รองรับข้อมูลสินค้าหลายรูปแบบจาก API
function getList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

// จัดการ URL รูปภาพ
function getImageUrl(value) {
  if (!value || typeof value !== "string") return "";

  const url = value.trim().replaceAll("\\", "/");

  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return url;

  return url.includes("/") ? `/${url}` : `/images/${url}`;
}

// แสดงรูปสินค้า
function ProductImage({ product }) {
  const [failed, setFailed] = useState(false);

  const imageUrl = getImageUrl(product.image_url);

  useEffect(() => {
    setFailed(false);
  }, [imageUrl]);

  if (!imageUrl || failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-green-50 text-green-700">
        <ImageOff size={42} />
        <span className="text-sm mt-2">ไม่มีรูปสินค้า</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={product.product_name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="w-full h-full object-contain p-4"
    />
  );
}

export default function Shop({ user, setPage }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [addingId, setAddingId] = useState(null);

  // โหลดสินค้า
  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();
      setProducts(getList(data));
    } catch (err) {
      setError(err.message || "ไม่สามารถโหลดสินค้าได้");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // ดึงรายการหมวดหมู่
  const categories = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.category_name)
          .filter(Boolean)
      ),
    ];
  }, [products]);

  // ค้นหาและกรองสินค้าตามหมวดหมู่
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productName = (product.product_name || "").toLowerCase();
      const keyword = search.trim().toLowerCase();

      const matchSearch = productName.includes(keyword);

      const matchCategory =
        selectedCategory === "ทั้งหมด" ||
        product.category_name === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [products, search, selectedCategory]);

  // เพิ่มสินค้าในตะกร้า
  async function handleAddToCart(product) {
    if (!user) {
      setPage("login");
      return;
    }

    if (user.role !== "member") {
      setMessage("บัญชี Admin ไม่สามารถสั่งซื้อสินค้าได้");
      return;
    }

    try {
      setAddingId(product.product_id);
      setMessage("");

      await addCartItem(product.product_id, 1);

      setMessage(`เพิ่ม ${product.product_name} ลงตะกร้าแล้ว`);
    } catch (err) {
      setMessage(err.message || "เพิ่มสินค้าลงตะกร้าไม่สำเร็จ");
    } finally {
      setAddingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* HERO BANNER */}
      <section className="bg-gradient-to-r from-green-900 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-5 py-14 md:py-20">

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm mb-5">
              <HeartPulse size={18} />
              Pharmacy Online
            </div>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              ร้านขายยาออนไลน์
              <br />
              ดูแลสุขภาพของคุณ
            </h1>

            <p className="mt-5 text-green-100 text-base md:text-lg">
              เลือกชมยาและผลิตภัณฑ์เพื่อสุขภาพ
              ได้ง่าย ๆ ผ่านร้านขายยาออนไลน์
            </p>

            <button
              onClick={() =>
                document.getElementById("products")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="mt-7 bg-white text-green-800 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition"
            >
              เลือกซื้อสินค้า
            </button>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-5 -mt-7 relative">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-white shadow-sm rounded-xl p-5 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl text-green-700">
              <Pill size={25} />
            </div>

            <div>
              <h3 className="font-bold">สินค้าหลากหลาย</h3>
              <p className="text-sm text-gray-500">
                เลือกชมสินค้าได้สะดวก
              </p>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-xl p-5 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-700">
              <Package size={25} />
            </div>

            <div>
              <h3 className="font-bold">ตรวจสอบสินค้า</h3>
              <p className="text-sm text-gray-500">
                แสดงจำนวนสินค้าคงเหลือ
              </p>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-xl p-5 flex items-center gap-4">
            <div className="bg-pink-100 p-3 rounded-xl text-pink-700">
              <HeartPulse size={25} />
            </div>

            <div>
              <h3 className="font-bold">ใส่ใจสุขภาพ</h3>
              <p className="text-sm text-gray-500">
                เลือกสินค้าตามความต้องการ
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* PRODUCT SECTION */}
      <section
        id="products"
        className="max-w-7xl mx-auto px-5 py-12"
      >

        {/* TITLE + SEARCH */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-7">

          <div>
            <p className="text-green-700 font-semibold text-sm">
              OUR PRODUCTS
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-1">
              สินค้าทั้งหมด
            </h2>

            <p className="text-gray-500 mt-2">
              พบสินค้า {filteredProducts.length} รายการ
            </p>
          </div>

          <div className="relative w-full md:w-80">

            <Search
              className="absolute left-4 top-3.5 text-gray-400"
              size={19}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อสินค้า..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-10 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
                aria-label="ล้างคำค้นหา"
              >
                <X size={18} />
              </button>
            )}

          </div>
        </div>

        {/* CATEGORY FILTER */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-700 mb-3">
            เลือกหมวดหมู่สินค้า
          </h3>

          <div className="flex flex-wrap gap-2">

            {["ทั้งหมด", ...categories].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium border transition ${
                  selectedCategory === category
                    ? "bg-green-700 text-white border-green-700 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {category}
              </button>
            ))}

          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl mb-6 flex justify-between items-center">
            <p>{message}</p>

            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="ปิดข้อความ"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20">
            <RefreshCw
              className="animate-spin mx-auto text-green-700"
              size={35}
            />

            <p className="text-gray-500 mt-4">
              กำลังโหลดสินค้า...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="text-center py-16 bg-white rounded-2xl border">
            <p className="text-red-600 mb-4">{error}</p>

            <button
              type="button"
              onClick={loadProducts}
              className="bg-green-700 text-white px-5 py-2 rounded-lg"
            >
              ลองใหม่
            </button>
          </div>
        )}

        {/* PRODUCT GRID */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {filteredProducts.map((product) => (
              <article
                key={product.product_id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >

                {/* IMAGE */}
                <div className="relative h-56 bg-white border-b flex items-center justify-center">

                  <ProductImage product={product} />

                  {Number(product.stock) <= 0 && (
                    <span className="absolute top-3 right-3 bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                      สินค้าหมด
                    </span>
                  )}

                </div>

                {/* DETAILS */}
                <div className="p-5">

                  {product.category_name && (
                    <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
                      {product.category_name}
                    </span>
                  )}

                  <h3 className="font-bold text-lg text-gray-800 mt-3 line-clamp-1">
                    {product.product_name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-10">
                    {product.description || "ไม่มีรายละเอียดสินค้า"}
                  </p>

                  <div className="mt-5">
                    <p className="text-2xl font-bold text-green-700">
                      {Number(product.price).toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                      })}
                      <span className="text-sm ml-1">บาท</span>
                    </p>
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    คงเหลือ {product.stock} ชิ้น
                  </p>

                  <button
                    type="button"
                    disabled={
                      Number(product.stock) <= 0 ||
                      addingId === product.product_id
                    }
                    onClick={() => handleAddToCart(product)}
                    className="w-full mt-4 bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={19} />

                    {addingId === product.product_id
                      ? "กำลังเพิ่ม..."
                      : Number(product.stock) <= 0
                      ? "สินค้าหมด"
                      : user
                      ? "เพิ่มลงตะกร้า"
                      : "เข้าสู่ระบบเพื่อสั่งซื้อ"}

                  </button>

                </div>
              </article>
            ))}

            {/* NO PRODUCTS */}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl border">

                <Package
                  size={45}
                  className="mx-auto text-gray-300"
                />

                <h3 className="font-bold text-gray-700 mt-4">
                  ไม่พบสินค้า
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  ลองเลือกหมวดหมู่หรือค้นหาด้วยคำอื่น
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("ทั้งหมด");
                  }}
                  className="mt-4 text-green-700 font-semibold hover:underline"
                >
                  ล้างตัวกรอง
                </button>

              </div>
            )}

          </div>
        )}

      </section>

      {/* FOOTER */}
      <footer className="bg-green-950 text-green-100 mt-10">
        <div className="max-w-7xl mx-auto px-5 py-8 text-center">

          <h3 className="font-bold text-xl">
            Pharmacy Online
          </h3>

          <p className="text-sm text-green-200 mt-2">
            ร้านขายยาออนไลน์ เพื่อการเลือกชมสินค้าเพื่อสุขภาพ
          </p>

          <p className="text-xs text-green-300 mt-5">
            © {new Date().getFullYear()} Pharmacy Online
          </p>

        </div>
      </footer>

    </main>
  );
}
