export interface ServicePayload {
  sellerId: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  price: number;
  images: Array<{ url: string; publicId?: string }>;
  isActive?: boolean;
  benefits?: string;
  image?: string;
  subCategory?: string;
  fullDescription?: string;
  availableDays?: string[];
  gender?: "Men" | "Women" | "Unisex";
  status?: "Active" | "Draft";
  homeServiceAvailable?: boolean;
  featuredService?: boolean;
}
