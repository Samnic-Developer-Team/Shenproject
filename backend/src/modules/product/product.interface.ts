export interface ProductImage {
  url: string;
  publicId?: string;
}

export interface ProductPayload {
  sellerId: string;
  name: string;
  description: string;
  category: string;
  brand?: string;
  price: number;
  stock: number;
  images: ProductImage[];
  image?: string;
  ratings?: number;
  isActive?: boolean;
  size?: string;
  ingredients?: string;
  howToUse?: string;
  subCategory?: string;
  productType?: string;
  mrp?: number;
  discount?: number;
  status?: "Active" | "Draft" | "Out of Stock";
  gallery?: string[];
  fullDescription?: string;
  skinType?: string;
  hairType?: string;
  tags?: string[];
  weight?: string;
  shippingCharge?: number;
  metaTitle?: string;
  metaDescription?: string;
}

