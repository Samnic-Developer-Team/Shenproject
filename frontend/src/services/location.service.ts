import { apiRequest } from "@/lib/api";

export interface Location {
  _id: string;
  city: string;
  state: string;
  isActive: boolean;
}

export async function listActiveLocations(): Promise<Location[]> {
  try {
    const res = await apiRequest<{ data: Location[] }>("/locations?active=true");
    return res.data || [];
  } catch (err) {
    console.error("Failed to list active locations:", err);
    return [];
  }
}
