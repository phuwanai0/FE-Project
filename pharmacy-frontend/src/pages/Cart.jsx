
import { useEffect, useState } from "react";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  createOrder,
} from "../services/api";

function getItems(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.cart_items)) return data.cart_items;
  return [];
}

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCart() {
    try {
      setLoading(true);
      const data = await getCart();
      setItems(getItems(data));
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function changeQuantity(item, quantity) {
    if (quantity < 1) return;

    try {
      await updateCartItem(item.cart_item_id, quantity);
      await loadCart();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeItem(item) {
    try {
      await removeCartItem(item.cart_item_id);
      await loadCart();
    } catch (err) {
      setError(err.message);
    }
  }

  async function checkout() {
    try {
      const result = await createOrder();
      alert(result?.message || "ส่งคำสั่งซื้อสำเร็จ");
      await loadCart();
    } catch (err) {
      setError(err.message);
    }
  }

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.price || item.product?.price || 0) *
        Number(item.quantity || 0),
    0
  );

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ตะกร้าสินค้า</h1>

      {loading && <p>กำลังโหลดตะกร้า...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!loading && items.length === 0 && (
        <p className="text-gray-500">ยังไม่มีสินค้าในตะกร้า</p>
      )}

      {items.map((item) => {
        const product = item.product || item;
        const name = product.product_name || "สินค้า";
        const price = Number(item.price || product.price || 0);

        return (
          <div
            key={item.cart_item_id}
            className="bg-white border rounded-xl p-4 mb-3 flex justify-between items-center gap-4"
          >
            <div>
              <h2 className="font-semibold">{name}</h2>
              <p className="text-green-700">{price.toFixed(2)} บาท</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => changeQuantity(item, Number(item.quantity) - 1)}
                className="border rounded px-3 py-1"
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() => changeQuantity(item, Number(item.quantity) + 1)}
                className="border rounded px-3 py-1"
              >
                +
              </button>

              <button
                onClick={() => removeItem(item)}
                className="text-red-600 ml-2"
              >
                ลบ
              </button>
            </div>
          </div>
        );
      })}

      {items.length > 0 && (
        <div className="bg-white border rounded-xl p-5 mt-6">
          <div className="flex justify-between text-xl font-bold">
            <span>รวมทั้งหมด</span>
            <span className="text-green-700">
              {total.toLocaleString("th-TH", {
                minimumFractionDigits: 2,
              })} บาท
            </span>
          </div>

          <button
            onClick={checkout}
            className="w-full bg-green-700 text-white p-3 rounded-lg mt-5"
          >
            ยืนยันสั่งซื้อ
          </button>
        </div>
      )}
    </main>
  );
}
