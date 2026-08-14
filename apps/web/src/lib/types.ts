export type UserRole = "USER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone: string | null;
}

export interface Category {
  id: string;
  slug: string;
  displayOrder: number;
  nameFa: string;
  nameEn: string;
  descriptionFa: string;
  descriptionEn: string;
}

export interface Product {
  id: string;
  categoryId: string;
  category?: Category;
  slug: string;
  nameFa: string;
  nameEn: string;
  summaryFa: string;
  summaryEn: string;
  descriptionFa: string;
  descriptionEn: string;
  unitFa: string;
  unitEn: string;
  price: number;
  stock: number;
  images: string[];
  featured: boolean;
  published: boolean;
  displayOrder: number;
}

export type OrderStatus = "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface OrderItem {
  id: string;
  productId: string | null;
  nameFa: string;
  nameEn: string;
  unitPrice: number;
  quantity: number;
}

export interface Payment {
  id: string;
  provider: string;
  authority: string | null;
  refId: string | null;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  contactName: string;
  contactPhone: string;
  province: string;
  city: string;
  addressLine: string;
  postalCode: string | null;
  note: string | null;
  subtotal: number;
  shippingCost: number;
  total: number;
  items: OrderItem[];
  payments: Payment[];
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  handled: boolean;
  createdAt: string;
}
