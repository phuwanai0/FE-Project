
import {
  Pill,
  ShoppingCart,
  User,
  LogOut,
  KeyRound,
} from "lucide-react";

export default function Navbar({
  user,
  page,
  setPage,
  onLogout,
}) {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
        <button
          onClick={() => setPage("shop")}
          className="flex items-center gap-2 text-green-800 font-bold text-xl"
        >
          <Pill size={28} />
          Pharmacy
        </button>

        <div className="flex items-center gap-4">
          <button onClick={() => setPage("shop")}>
            หน้าร้าน
          </button>

          {user?.role === "member" && (
            <>
              <button
                onClick={() => setPage("cart")}
                className="flex items-center gap-1"
              >
                <ShoppingCart size={19} />
                ตะกร้า
              </button>

              <button
                onClick={() => setPage("change-password")}
                className={`flex items-center gap-1 ${
                  page === "change-password"
                    ? "text-green-700 font-semibold"
                    : "text-gray-600"
                }`}
              >
                <KeyRound size={18} />
                เปลี่ยนรหัสผ่าน
              </button>
            </>
          )}

          {user?.role === "admin" && (
            <button
              onClick={() => setPage("admin")}
              className="text-green-700 font-semibold"
            >
              จัดการร้านค้า
            </button>
          )}

          {!user ? (
            <>
              <button
                onClick={() => setPage("login")}
                className="text-green-700"
              >
                เข้าสู่ระบบ
              </button>

              <button
                onClick={() => setPage("register")}
                className="bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                สมัครสมาชิก
              </button>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1 text-gray-600">
                <User size={18} />
                {user.username}
              </span>

              <button
                onClick={onLogout}
                className="text-red-600 flex items-center gap-1"
              >
                <LogOut size={18} />
                ออกจากระบบ
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
