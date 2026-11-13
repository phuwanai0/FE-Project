
import { useState } from "react";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Pill,
} from "lucide-react";
import { changeMyPassword } from "../services/api";

// ต้องประกาศไว้นอก ChangePassword
function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  show,
  toggle,
  disabled,
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          disabled={disabled}
          className="w-full rounded-xl border border-gray-200 bg-gray-50
            px-4 py-3.5 pr-12 text-gray-800 outline-none
            transition focus:border-green-500 focus:bg-white
            focus:ring-4 focus:ring-green-100
            disabled:opacity-60"
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-4 top-1/2 -translate-y-1/2
            text-gray-400 hover:text-green-700"
          aria-label={show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
        >
          {show ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (newPassword.length < 8) {
      setError("รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านใหม่และการยืนยันไม่ตรงกัน");
      return;
    }

    if (currentPassword === newPassword) {
      setError("กรุณาตั้งรหัสผ่านใหม่ที่แตกต่างจากรหัสผ่านเดิม");
      return;
    }

    try {
      setLoading(true);

      const result = await changeMyPassword(
        currentPassword,
        newPassword
      );

      setMessage(result.message || "เปลี่ยนรหัสผ่านสำเร็จ");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] bg-gradient-to-br
      from-green-50 via-white to-emerald-50
      flex items-center justify-center px-4 py-12">

      <div className="w-full max-w-lg">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center
            w-16 h-16 rounded-2xl bg-green-700 text-white
            shadow-lg shadow-green-200 mb-4">
            <Pill size={32} />
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            เปลี่ยนรหัสผ่าน
          </h1>

          <p className="text-gray-500 mt-2">
            จัดการความปลอดภัยของบัญชี Pharmacy
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl
          shadow-green-900/5 border border-green-50
          p-6 sm:p-9">

          <div className="flex items-center gap-3 mb-7
            rounded-2xl bg-green-50 p-4">
            <div className="w-11 h-11 rounded-xl bg-green-100
              flex items-center justify-center text-green-700">
              <ShieldCheck size={25} />
            </div>

            <div>
              <h2 className="font-bold text-gray-800">
                ความปลอดภัยบัญชี
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                กรุณากรอกรหัสผ่านเพื่อยืนยันตัวตน
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <PasswordInput
              label="รหัสผ่านปัจจุบัน"
              placeholder="กรอกรหัสผ่านปัจจุบัน"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              show={showCurrent}
              toggle={() => setShowCurrent((v) => !v)}
              disabled={loading}
            />

            <div className="border-t border-gray-100 pt-5">
              <PasswordInput
                label="รหัสผ่านใหม่"
                placeholder="กรอกรหัสผ่านใหม่"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                show={showNew}
                toggle={() => setShowNew((v) => !v)}
                disabled={loading}
              />

              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <LockKeyhole size={14} />
                ต้องมีอย่างน้อย 8 ตัวอักษร
              </div>
            </div>

            <PasswordInput
              label="ยืนยันรหัสผ่านใหม่"
              placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              show={showConfirm}
              toggle={() => setShowConfirm((v) => !v)}
              disabled={loading}
            />

            {message && (
              <div className="flex items-start gap-3 rounded-xl
                bg-green-50 border border-green-200 p-4 text-green-700">
                <CheckCircle2 size={21} className="shrink-0" />
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 rounded-xl
                bg-red-50 border border-red-200 p-4 text-red-600">
                <AlertCircle size={21} className="shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2
                rounded-xl bg-green-700 hover:bg-green-800
                text-white font-semibold py-4 mt-3
                shadow-lg shadow-green-200 transition
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <KeyRound size={19} />
              {loading ? "กำลังบันทึก..." : "บันทึกรหัสผ่าน"}
            </button>

          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          <ShieldCheck size={14} className="inline mr-1" />
          Pharmacy · ระบบดูแลความปลอดภัยบัญชีสมาชิก
        </p>

      </div>
    </div>
  );
}
