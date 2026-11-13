
import { useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import ChangePassword from "./pages/ChangePassword";

// ADMIN PAGES
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminCategories from "./admin/AdminCategories";
import AdminOrders from "./admin/AdminOrders";
import AdminUsers from "./admin/AdminUsers";

function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState(getSavedUser);
  const [page, setPage] = useState("shop");
  const [adminPage, setAdminPage] = useState("Dashboard");

  function handleLogin(data) {
    const loggedInUser = {
      user_id: data.user_id,
      username: data.username,
      role: data.role,
    };

    setUser(loggedInUser);

    localStorage.setItem("user", JSON.stringify(loggedInUser));

    setPage(data.role === "admin" ? "admin" : "shop");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setPage("shop");
    setAdminPage("Dashboard");
  }

  function renderAdminPage() {
    switch (adminPage) {
      case "สินค้า":
        return <AdminProducts />;

      case "หมวดหมู่":
        return <AdminCategories />;

      case "คำสั่งซื้อ":
        return <AdminOrders />;

      case "สมาชิก":
        return <AdminUsers />;

      case "Dashboard":
      default:
        return <AdminDashboard />;
    }
  }

  function renderPage() {
    // LOGIN
    if (page === "login") {
      return (
        <Login
          onLogin={handleLogin}
          setPage={setPage}
        />
      );
    }

    // REGISTER
    if (page === "register") {
      return <Register setPage={setPage} />;
    }

    // CHANGE PASSWORD
    if (page === "change-password") {
      if (!user || user.role !== "member") {
        return <Login onLogin={handleLogin} setPage={setPage} />;
      }

      return <ChangePassword />;
    }

    // CART
    if (page === "cart") {
      if (!user || user.role !== "member") {
        return (
          <Login
            onLogin={handleLogin}
            setPage={setPage}
          />
        );
      }

      return <Cart />;
    }

    // ADMIN
    if (page === "admin") {
      if (!user || user.role !== "admin") {
        return <Shop user={user} setPage={setPage} />;
      }

      return (
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar
            activePage={adminPage}
            setActivePage={setAdminPage}
          />

          <div className="flex-1 min-w-0">
            {renderAdminPage()}
          </div>
        </div>
      );
    }

    // MEMBER / SHOP
    return <Shop user={user} setPage={setPage} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={user}
        page={page}
        setPage={setPage}
        onLogout={handleLogout}
      />

      {renderPage()}
    </div>
  );
}
