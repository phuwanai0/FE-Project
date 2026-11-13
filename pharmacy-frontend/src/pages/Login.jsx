
import { useState } from "react";
import { login } from "../services/api";

export default function Login({ onLogin, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const data = await login(email, password);

      if (!data.token) {
        throw new Error("ไม่พบ Token จาก Backend");
      }

      if (!["admin", "member"].includes(data.role)) {
        throw new Error("ไม่พบสิทธิ์ผู้ใช้งาน");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          user_id: data.user_id,
          username: data.username,
          role: data.role,
        })
      );

      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-green-50 flex items-center justify-center p-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5"
      >
        <h1 className="text-2xl font-bold text-center">
          เข้าสู่ระบบ
        </h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="อีเมล"
          required
          className="w-full border rounded-lg p-3"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="รหัสผ่าน"
          required
          className="w-full border rounded-lg p-3"
        />

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <button
          disabled={loading}
          className="w-full bg-green-700 text-white p-3 rounded-lg"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>

        <p className="text-center text-sm">
          ยังไม่มีบัญชี?
          <button
            type="button"
            onClick={() => setPage("register")}
            className="text-green-700 ml-1"
          >
            สมัครสมาชิก
          </button>
        </p>

        <button
          type="button"
          onClick={() => setPage("shop")}
          className="w-full text-gray-500"
        >
          กลับไปเลือกซื้อสินค้า
        </button>
      </form>
    </main>
  );
}
