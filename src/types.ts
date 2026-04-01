export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  specs: Record<string, string>;
  gallery: string[];
  has3D?: boolean;
  videoUrl?: string;
  isFeatured?: boolean;
  sku?: string;
  ean?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
