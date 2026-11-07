import { apiRequest } from "@/lib/api";

export interface Service {
  _id: string;
  id?: string;
  sellerId: string;
  title: string;
  label?: string;
  description: string;
  category: string;
  duration: number | string;
  price: number;
  image?: string;
  images?: { url: string; publicId?: string }[];
  isActive?: boolean;
  benefits?: string;
  subCategory?: string;
  fullDescription?: string;
  availableDays?: string[];
  gender?: "Men" | "Women" | "Unisex";
  status?: "Active" | "Draft";
  homeServiceAvailable?: boolean;
  featuredService?: boolean;
  createdAt?: string;
}

export async function listServices(params?: Record<string, string>): Promise<Service[]> {
  try {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    const res = await apiRequest<{ data: Service[] }>(`/services${query}`);
    return res.data || [];
  } catch (err) {
    console.warn("Failed to list services:", err);
    return [];
  }
}

export async function createService(payload: Record<string, unknown>): Promise<Service> {
  const res = await apiRequest<{ data: Service }>("/services", {
    method: "POST",
    bodyData: payload,
  });
  return res.data;
}

export async function updateService(id: string, payload: Record<string, unknown>): Promise<Service> {
  const res = await apiRequest<{ data: Service }>(`/services/${id}`, {
    method: "PATCH",
    bodyData: payload,
  });
  return res.data;
}

export async function deleteService(id: string): Promise<void> {
  await apiRequest(`/services/${id}`, { method: "DELETE" });
}
