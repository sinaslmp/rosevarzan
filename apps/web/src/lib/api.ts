import type { AuthUser, Category, ContactMessage, Order, OrderStatus, Product } from "./types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4010";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}/v1${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...init,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = Array.isArray(payload?.message) ? payload.message[0] : payload?.message;
    throw new ApiError(message ?? "Request failed", response.status);
  }
  return (payload?.data ?? payload) as T;
}

// --- Auth ---
export const auth = {
  me: () => apiFetch<{ user: AuthUser }>("/auth/me"),
  login: (input: { email: string; password: string }) =>
    apiFetch<{ user: AuthUser }>("/auth/login", { method: "POST", body: JSON.stringify(input) }),
  register: (input: { fullName: string; email: string; password: string; phone?: string }) =>
    apiFetch<{ user: AuthUser }>("/auth/register", { method: "POST", body: JSON.stringify(input) }),
  logout: () => apiFetch<{ success: boolean }>("/auth/logout", { method: "POST" }),
  updateProfile: (input: { fullName?: string; phone?: string }) =>
    apiFetch<{ user: AuthUser }>("/auth/profile", { method: "PATCH", body: JSON.stringify(input) }),
  changePassword: (input: { currentPassword: string; newPassword: string }) =>
    apiFetch<{ success: boolean }>("/auth/change-password", { method: "POST", body: JSON.stringify(input) }),
};

// --- Catalog ---
export const catalog = {
  categories: () => apiFetch<{ categories: Category[] }>("/categories"),
  products: (query?: { category?: string; search?: string; featured?: boolean }) => {
    const params = new URLSearchParams();
    if (query?.category) params.set("category", query.category);
    if (query?.search) params.set("search", query.search);
    if (query?.featured) params.set("featured", "true");
    const qs = params.toString();
    return apiFetch<{ products: Product[] }>(`/products${qs ? `?${qs}` : ""}`);
  },
  product: (slug: string) => apiFetch<{ product: Product }>(`/products/${encodeURIComponent(slug)}`),
};

// --- Orders & payments ---
export const orders = {
  create: (input: {
    contactName: string;
    contactPhone: string;
    province: string;
    city: string;
    addressLine: string;
    postalCode?: string;
    note?: string;
    items: { productId: string; quantity: number }[];
  }) => apiFetch<{ order: Order }>("/orders", { method: "POST", body: JSON.stringify(input) }),
  get: (id: string) => apiFetch<{ order: Order }>(`/orders/${id}`),
};

export const payments = {
  request: (orderId: string) => apiFetch<{ gatewayUrl: string }>("/payments/request", { method: "POST", body: JSON.stringify({ orderId }) }),
};

// --- Account ---
export const account = {
  orders: () => apiFetch<{ orders: Order[] }>("/account/orders"),
};

// --- Contact ---
export const contact = {
  send: (input: { name: string; email?: string; phone?: string; subject?: string; message: string }) =>
    apiFetch<{ message: ContactMessage }>("/contact", { method: "POST", body: JSON.stringify(input) }),
};

// --- Admin ---
export const admin = {
  overview: () =>
    apiFetch<{ userCount: number; orderCount: number; pendingOrders: number; revenue: number; unhandledMessages: number; lowStockProducts: number }>(
      "/admin/overview",
    ),
  categories: () => apiFetch<{ categories: Category[] }>("/admin/categories"),
  createCategory: (input: Omit<Category, "id">) => apiFetch<{ category: Category }>("/admin/categories", { method: "POST", body: JSON.stringify(input) }),
  updateCategory: (id: string, input: Partial<Omit<Category, "id">>) =>
    apiFetch<{ category: Category }>(`/admin/categories/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
  deleteCategory: (id: string) => apiFetch<{ success: boolean }>(`/admin/categories/${id}`, { method: "DELETE" }),

  products: () => apiFetch<{ products: Product[] }>("/admin/products"),
  createProduct: (input: Omit<Product, "id" | "category">) =>
    apiFetch<{ product: Product }>("/admin/products", { method: "POST", body: JSON.stringify(input) }),
  updateProduct: (id: string, input: Partial<Omit<Product, "id" | "category">>) =>
    apiFetch<{ product: Product }>(`/admin/products/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
  deleteProduct: (id: string) => apiFetch<{ success: boolean }>(`/admin/products/${id}`, { method: "DELETE" }),

  orders: (status?: OrderStatus) => apiFetch<{ orders: (Order & { user: AuthUser | null })[] }>(`/admin/orders${status ? `?status=${status}` : ""}`),
  order: (id: string) => apiFetch<{ order: Order & { user: AuthUser | null } }>(`/admin/orders/${id}`),
  updateOrderStatus: (id: string, status: OrderStatus) =>
    apiFetch<{ order: Order }>(`/admin/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  users: () => apiFetch<{ users: AuthUser[] }>("/admin/users"),
  updateUser: (id: string, input: { role?: "USER" | "ADMIN"; active?: boolean }) =>
    apiFetch<{ user: AuthUser }>(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(input) }),

  contactMessages: () => apiFetch<{ messages: ContactMessage[] }>("/admin/contact-messages"),
  updateContactMessage: (id: string, handled: boolean) =>
    apiFetch<{ message: ContactMessage }>(`/admin/contact-messages/${id}`, { method: "PATCH", body: JSON.stringify({ handled }) }),
};

export function getApiUrl() {
  return apiUrl;
}
