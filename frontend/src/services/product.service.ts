import { apiRequest } from "@/lib/api";

export interface Product {
  _id: string;
  id?: string;
  sellerId: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image?: string;
  images?: { url: string; publicId?: string }[];
  gallery?: string[];
  size?: string;
  ingredients?: string;
  howToUse?: string;
  subCategory?: string;
  productType?: string;
  mrp?: number;
  discount?: number;
  status?: "Active" | "Draft" | "Out of Stock";
  fullDescription?: string;
  skinType?: string;
  hairType?: string;
  tags?: string[];
  weight?: string;
  shippingCharge?: number;
  metaTitle?: string;
  metaDescription?: string;
  ratings?: number;
  isActive?: boolean;
  createdAt?: string;
}

export async function listProducts(params?: Record<string, string>): Promise<Product[]> {
  try {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    const res = await apiRequest<{ data: Product[] }>(`/products${query}`);
    return res.data || [];
  } catch (err) {
    console.warn("Failed to list products:", err);
    return [];
  }
}

export async function createProduct(payload: Record<string, unknown>): Promise<Product> {
  const res = await apiRequest<{ data: Product }>("/products", {
    method: "POST",
    bodyData: payload,
  });
  return res.data;
}

export async function updateProduct(id: string, payload: Record<string, unknown>): Promise<Product> {
  const res = await apiRequest<{ data: Product }>(`/products/${id}`, {
    method: "PATCH",
    bodyData: payload,
  });
  return res.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await apiRequest(`/products/${id}`, { method: "DELETE" });
}
