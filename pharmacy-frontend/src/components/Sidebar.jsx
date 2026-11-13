
const menuItems = [
  "Dashboard",
  "สินค้า",
  "หมวดหมู่",
  "คำสั่งซื้อ",
  "สมาชิก",
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-5">
      <h2 className="text-xl font-bold mb-8">
        Pharmacy Admin
      </h2>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item}
            onClick={() => setActivePage(item)}
            className={`w-full text-left px-4 py-3 rounded-lg ${
              activePage === item
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}
