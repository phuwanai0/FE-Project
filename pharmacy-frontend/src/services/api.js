
export const API_BASE_URL = (import.meta.env.VITE_API_URL || "")
  .trim()
  .replace(/\/+$/, "");

// ===============================
// AUTH / TOKEN
// ===============================

export function getToken() {
  return localStorage.getItem("token");
}

export function saveToken(token) {
  if (token) {
    localStorage.setItem("token", token);
  }
}

export function removeToken() {
  localStorage.removeItem("token");
}

// ===============================
// API FETCH
// ===============================

export async function apiFetch(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("ไม่พบ VITE_API_URL ในไฟล์ .env");
  }

  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const responseText = await response.text();

  let data = null;

  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
      data?.message ||
      responseText ||
      `HTTP ${response.status}`
    );
  }

  return data;
}

// ===============================
// AUTH API
// ===============================

export const login = async (email, password) => {
  const data = await apiFetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const token = data?.token || data?.access_token;

  if (token) {
    saveToken(token);
  }

  return data;
};

export const register = (username, email, password) =>
  apiFetch("/api/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

export const logout = () => {
  removeToken();
  localStorage.removeItem("user");
};

// เปลี่ยนรหัสผ่านของสมาชิกที่เข้าสู่ระบบอยู่
export const changeMyPassword = (currentPassword, newPassword) =>
  apiFetch("/api/auth/change-password", {
    method: "PUT",
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });

// ===============================
// PRODUCT API
// ===============================

export const getProducts = () =>
  apiFetch("/api/products");

export const getProductById = (id) =>
  apiFetch(`/api/products/${id}`);

export const createProduct = (product) =>
  apiFetch("/api/products", {
    method: "POST",
    body: JSON.stringify(product),
  });

export const updateProduct = (id, product) =>
  apiFetch(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });

export const deleteProduct = (id) =>
  apiFetch(`/api/products/${id}`, {
    method: "DELETE",
  });

// ===============================
// CATEGORY API
// ===============================

export const getCategories = () =>
  apiFetch("/api/categories");

export const getCategoryById = (id) =>
  apiFetch(`/api/categories/${id}`);

export const createCategory = (category) =>
  apiFetch("/api/categories", {
    method: "POST",
    body: JSON.stringify(category),
  });

export const updateCategory = (id, category) =>
  apiFetch(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(category),
  });

export const deleteCategory = (id) =>
  apiFetch(`/api/categories/${id}`, {
    method: "DELETE",
  });

// ===============================
// CART API
// ===============================

export const getCart = () =>
  apiFetch("/api/cart");

export const addCartItem = (product_id, quantity = 1) =>
  apiFetch("/api/cart/items", {
    method: "POST",
    body: JSON.stringify({
      product_id,
      quantity,
    }),
  });

export const updateCartItem = (item_id, quantity) =>
  apiFetch(`/api/cart/items/${item_id}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });

export const removeCartItem = (item_id) =>
  apiFetch(`/api/cart/items/${item_id}`, {
    method: "DELETE",
  });

// ===============================
// ORDER API
// ===============================

export const createOrder = () =>
  apiFetch("/api/orders", {
    method: "POST",
  });

export const getMyOrders = () =>
  apiFetch("/api/orders/my");

// ===============================
// ADMIN USERS API
// ===============================

export const getUsers = () =>
  apiFetch("/api/admin/users");

// Admin เปลี่ยนรหัสผ่านสมาชิก
export const updateUserPassword = (id, password) =>
  apiFetch(`/api/admin/users/${id}/password`, {
    method: "PUT",
    body: JSON.stringify({ password }),
  });

// Admin ลบสมาชิก
export const deleteUser = (id) =>
  apiFetch(`/api/admin/users/${id}`, {
    method: "DELETE",
  });

// ===============================
// ADMIN ORDERS API
// ===============================

export const getAdminOrders = () =>
  apiFetch("/api/admin/orders");
