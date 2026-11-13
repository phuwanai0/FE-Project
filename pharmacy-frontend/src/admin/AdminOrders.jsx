
import { useEffect, useState, useCallback } from "react";
import {
  ShoppingBag,
  RefreshCw,
  Eye,
  X,
  Package,
  CalendarDays,
  User,
  AlertCircle,
} from "lucide-react";

import { getAdminOrders } from "../services/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // โหลดคำสั่งซื้อทั้งหมด
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminOrders();

      setOrders(Array.isArray(data?.orders) ? data.orders : []);
    } catch (err) {
      setError(err.message || "ไม่สามารถโหลดคำสั่งซื้อได้");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // แสดงวันที่
  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleString("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // แสดงราคา
  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("th-TH", {
      style: "currency",
      currency: "THB",
    });

  return (
    <main className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            คำสั่งซื้อ
          </h1>

          <p className="text-gray-500 mt-2">
            หน้าจัดการคำสั่งซื้อทั้งหมด
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center justify-center gap-2 border bg-white px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          <RefreshCw
            size={18}
            className={loading ? "animate-spin" : ""}
          />
          รีเฟรช
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <ShoppingBag size={24} />
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                คำสั่งซื้อทั้งหมด
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {orders.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              <Package size={24} />
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                ยอดคำสั่งซื้อรวม
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {formatPrice(
                  orders.reduce(
                    (sum, order) => sum + Number(order.total || 0),
                    0
                  )
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-5 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl p-10 text-center">
          <RefreshCw
            size={32}
            className="mx-auto animate-spin text-blue-500 mb-3"
          />
          <p className="text-gray-500">
            กำลังโหลดคำสั่งซื้อ...
          </p>
        </div>
      )}

      {/* Orders Table */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingBag
                size={48}
                className="mx-auto text-gray-300 mb-4"
              />

              <h2 className="text-lg font-semibold text-gray-700">
                ยังไม่มีคำสั่งซื้อ
              </h2>

              <p className="text-gray-500 mt-2">
                เมื่อมีลูกค้าสั่งซื้อ รายการจะแสดงที่นี่
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-5 py-4">เลขที่คำสั่งซื้อ</th>
                    <th className="px-5 py-4">ลูกค้า</th>
                    <th className="px-5 py-4">วันที่สั่งซื้อ</th>
                    <th className="px-5 py-4">จำนวนรายการ</th>
                    <th className="px-5 py-4">ยอดรวม</th>
                    <th className="px-5 py-4 text-center">รายละเอียด</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr
                      key={order.order_id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 font-semibold text-gray-800">
                        #{order.order_id}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <User size={17} className="text-gray-400" />
                          ลูกค้า #{order.user_id}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {formatDate(order.order_date)}
                      </td>

                      <td className="px-5 py-4">
                        {(order.items || []).length} รายการ
                      </td>

                      <td className="px-5 py-4 font-semibold text-green-700">
                        {formatPrice(order.total)}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg"
                        >
                          <Eye size={17} />
                          ดูรายละเอียด
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  คำสั่งซื้อ #{selectedOrder.order_id}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(selectedOrder.order_date)}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-500 text-sm">
                    รหัสลูกค้า
                  </p>
                  <p className="font-semibold">
                    #{selectedOrder.user_id}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-500 text-sm">
                    ยอดรวม
                  </p>
                  <p className="font-bold text-green-700">
                    {formatPrice(selectedOrder.total)}
                  </p>
                </div>
              </div>

              <h3 className="font-semibold text-gray-800">
                รายการสินค้า
              </h3>

              <div className="border rounded-lg divide-y">
                {(selectedOrder.items || []).map((item, index) => (
                  <div
                    key={`${item.product_id}-${index}`}
                    className="p-4 flex justify-between gap-3"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.product_name}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold text-gray-800 whitespace-nowrap">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                ))}

                {(selectedOrder.items || []).length === 0 && (
                  <p className="p-5 text-center text-gray-500">
                    ไม่พบรายการสินค้า
                  </p>
                )}
              </div>

              <div className="flex justify-between border-t pt-4">
                <span className="font-semibold">
                  ยอดรวมทั้งหมด
                </span>

                <span className="font-bold text-xl text-green-700">
                  {formatPrice(selectedOrder.total)}
                </span>
              </div>
            </div>

            <div className="p-5 border-t flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
