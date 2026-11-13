
import { useState } from "react";
import { register } from "../services/api";

export default function Register({ setPage }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      setLoading(true);
      await register(username, email, password);
      alert("สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ");
      setPage("login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-green-50 flex justify-center items-center p-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">
          สมัครสมาชิก
        </h1>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ชื่อผู้ใช้"
          required
          className="w-full border rounded-lg p-3"
        />

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
          placeholder="รหัสผ่านอย่างน้อย 8 ตัว"
          required
          minLength={8}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="ยืนยันรหัสผ่าน"
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
          {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
        </button>

        <p className="text-center text-sm">
          มีบัญชีแล้ว?
          <button
            type="button"
            onClick={() => setPage("login")}
            className="text-green-700 ml-1"
          >
            เข้าสู่ระบบ
          </button>
        </p>
      </form>
    </main>
  );
}
