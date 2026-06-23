import { apiRequest } from "@/lib/api";

export interface OrderedProduct {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  addressLine1: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface Order {
  _id: string;
  id?: string;
  userId: string;
  sellerId: string;
  orderedProducts: OrderedProduct[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  deliveryStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  shippingAddress: ShippingAddress;
  createdAt?: string;
}

export interface CreateOrderPayload {
  userId: string;
  sellerId: string;
  orderedProducts: OrderedProduct[];
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
}

export async function listOrders(): Promise<Order[]> {
  const res = await apiRequest<{ data: Order[] }>("/orders");
  return res.data || [];
}

export async function getUserOrders(): Promise<Order[]> {
  const res = await apiRequest<{ data: Order[] }>("/orders/user");
  return res.data || [];
}

export async function getSellerOrders(): Promise<Order[]> {
  const res = await apiRequest<{ data: Order[] }>("/orders/seller");
  return res.data || [];
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const res = await apiRequest<{ data: Order }>("/orders", {
    method: "POST",
    bodyData: payload,
  });
  return res.data;
}

export async function getOrderById(id: string): Promise<Order> {
  const res = await apiRequest<{ data: Order }>(`/orders/${id}`);
  return res.data;
}

export async function updateOrder(id: string, payload: Partial<Order>): Promise<Order> {
  const res = await apiRequest<{ data: Order }>(`/orders/${id}`, {
    method: "PATCH",
    bodyData: payload,
  });
  return res.data;
}
