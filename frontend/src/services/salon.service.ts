import { apiRequest } from "@/lib/api";

export interface Seller {
  _id: string;
  id?: string;
  salonName: string;
  ownerName: string;
  contact: string;
  email: string;
  address: string;
  city: string;
  state: string;
  shopLicence: string;
  shopImage: string;
  bio?: string;
  profileImage?: string;
  role: "SELLER";
  isApproved: boolean;
  isActive: boolean;
  createdAt?: string;
  serviceCount?: number;
  productCount?: number;
}

export async function listSalons(): Promise<Seller[]> {
  try {
    const res = await apiRequest<{ data: Seller[] }>("/sellers");
    return res.data || [];
  } catch (err) {
    console.warn("Failed to list salons:", err);
    return [];
  }
}

export async function getSalonById(id: string): Promise<Seller | null> {
  try {
    const res = await apiRequest<{ data: Seller | null }>(`/sellers/${id}`);
    return res.data;
  } catch {
    return null;
  }
}


export async function getSellerProfile(): Promise<Seller | null> {
  try {
    const res = await apiRequest<{ data: Seller | null }>("/sellers/me");
    return res.data;
  } catch {
    return null;
  }
}

export async function registerSellerShop(payload: Record<string, unknown>): Promise<Seller> {
  const res = await apiRequest<{ data: Seller }>("/sellers/register-shop", {
    method: "POST",
    bodyData: payload,
  });
  return res.data;
}

export async function updateSellerShop(payload: Record<string, unknown>): Promise<Seller> {
  const res = await apiRequest<{ data: Seller }>("/sellers/me", {
    method: "PUT",
    bodyData: payload,
  });
  return res.data;
}
