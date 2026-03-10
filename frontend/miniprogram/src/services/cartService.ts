import { request } from './request';
import type { ProductItem } from '../mock/data';

export interface CartPayload {
  list: Array<{
    id: string;
    productId: string;
    quantity: number;
    size: string;
    product?: ProductItem;
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
