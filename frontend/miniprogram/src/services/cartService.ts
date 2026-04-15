import { request } from './request';

export interface CartProductBrief {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  cover: string;
  category?: string;
  saleStatus?: string;
}

export interface CartPayload {
  list: Array<{
    id: string;
    productId: string;
    quantity: number;
    size: string;
    product?: CartProductBrief;
  }>;
  totalCount: number;
  totalAmount: number;
}

export function getCart() {
  return request<CartPayload>('/cart');
}

export function addCartItem(payload: { productId: string; quantity: number; size: string }) {
  return request<CartPayload>('/cart/items', {
    method: 'POST',
    data: payload
  });
}

export function updateCartItem(id: string, quantity: number) {
  return request<CartPayload>(`/cart/items/${id}`, {
    method: 'PATCH',
    data: {
      quantity
    }
  });
}

export function deleteCartItem(id: string) {
  return request<CartPayload>(`/cart/items/${id}`, {
    method: 'DELETE'
  });
}
