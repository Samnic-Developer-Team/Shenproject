export interface SellerProfile {
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
  isApproved?: boolean;
}
