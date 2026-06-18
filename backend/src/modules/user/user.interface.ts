export interface Address {
  label?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  street?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses?: Address[];
  wishlist?: string[];
}
