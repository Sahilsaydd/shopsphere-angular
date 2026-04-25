export interface CartProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  item_total: number;
  final_price?: number;
  image?: string;
  product_img?: string;
  description?: string;
}

export interface CartItem {
  id: number;
  quantity: number;
  is_active?: boolean;
  product?: CartProduct | null;
  product_id?: number;
  name?: string;
  price?: number;
  final_price?: number;
  category?: string;
  image?: string;
  product_img?: string;
  description?: string;
  created_at?: string;
  cart_id?: number;
}

export interface CartActionResponse {
  message?: string;
  detail?: string;
}

export interface CartResponseTotal {
  total_price: string;
}
