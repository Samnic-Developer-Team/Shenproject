export type Product = {
  slug: string;
  name: string;
  brand: string;
  price: string | number;
  image?: string;
  description?: string;
  id?: string;
  title?: string;
  oldPrice?: string | number;
  isSale?: boolean;
  category?: string;
};
