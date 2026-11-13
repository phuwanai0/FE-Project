
import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Users,
  Trash2,
  KeyRound,
  X,
} from "lucide-react";

import {
  getUsers,
  updateUserPassword,
  deleteUser,
} from "../services/api";

function getList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();
      setUsers(getList(data));
    } catch (err) {
      setError(err.message || "โหลดสมาชิกไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    `${user.username || ""} ${user.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  async function handleChangePassword(e) {
    e.preventDefault();

    if (!selectedUser) return;

    if (newPassword.length < 8) {
      setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await updateUserPassword(
        selectedUser.user_id,
        newPassword
      );

      setMessage(
        `เปลี่ยนรหัสผ่านของ ${selectedUser.username} สำเร็จ`
      );

      setSelectedUser(null);
      setNewPassword("");
    } catch (err) {
      setError(err.message || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(user) {
    if (user.role === "admin") return;

    const confirmed = window.confirm(
      `ต้องการลบสมาชิก ${user.username} ใช่หรือไม่?\nการลบนี้ไม่สามารถย้อนกลับได้`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteUser(user.user_id);

      setUsers((prev) =>
        prev.filter((item) => item.user_id !== user.user_id)
      );

      setMessage(`ลบสมาชิก ${user.username} สำเร็จ`);
    } catch (err) {
      setError(err.message || "ลบสมาชิกไม่สำเร็จ");
    }
  }

  return (
    <main className="p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            จัดการสมาชิก
          </h1>
          <p className="text-gray-500 mt-1">
            รายชื่อสมาชิกในร้านขายยา
          </p>
        </div>

        <button
          onClick={loadUsers}
          disabled={loading}
          className="flex items-center gap-2 border bg-white px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={18} />
          รีเฟรช
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-3 rounded-xl">
            <Users size={26} className="text-green-700" />
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              สมาชิกทั้งหมด
            </p>
            <p className="text-2xl font-bold">
              {users.length}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
          {message}
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
            placeholder="ค้นหาชื่อหรืออีเมล..."
            className="w-full border rounded-lg pl-10 pr-4 py-2"
          />
        </div>

        {loading ? (
          <p className="text-center py-6 text-gray-500">
            กำลังโหลดสมาชิก...
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">รหัส</th>
                  <th className="p-3">ชื่อผู้ใช้</th>
                  <th className="p-3">อีเมล</th>
                  <th className="p-3">สิทธิ์</th>
                  <th className="p-3">จัดการ</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.user_id} className="border-b">
                    <td className="p-3">{user.user_id}</td>
                    <td className="p-3">{user.username}</td>
                    <td className="p-3">{user.email}</td>

                    <td className="p-3">
                      <span
                        className={
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700 px-3 py-1 rounded-full"
                            : "bg-green-100 text-green-700 px-3 py-1 rounded-full"
                        }
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="p-3">
                      {user.role === "admin" ? (
                        <span className="text-gray-400 text-sm">
                          บัญชีผู้ดูแลระบบ
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setNewPassword("");
                              setError("");
                              setMessage("");
                            }}
                            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                          >
                            <KeyRound size={16} />
                            เปลี่ยนรหัส
                          </button>

                          <button
                            onClick={() => handleDelete(user)}
                            className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
                          >
                            <Trash2 size={16} />
                            ลบ
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-8 text-center text-gray-500"
                    >
                      ไม่พบสมาชิก
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">
                เปลี่ยนรหัสผ่านสมาชิก
              </h2>

              <button
                onClick={() => {
                  setSelectedUser(null);
                  setNewPassword("");
                  setError("");
                }}
                disabled={saving}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={22} />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              สมาชิก: <strong>{selectedUser.username}</strong>
            </p>

            <form onSubmit={handleChangePassword}>
              <label className="block text-sm font-medium mb-2">
                รหัสผ่านใหม่
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                required
                autoComplete="new-password"
                placeholder="กรอกรหัสผ่านใหม่อย่างน้อย 8 ตัว"
                className="w-full border rounded-lg px-4 py-3 mb-5"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUser(null);
                    setNewPassword("");
                    setError("");
                  }}
                  disabled={saving}
                  className="border px-4 py-2 rounded-lg"
                >
                  ยกเลิก
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "กำลังบันทึก..." : "บันทึกรหัสผ่าน"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
