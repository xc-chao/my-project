import { request } from './request';
import type { AdminFeedbackItem, AdminOverview, ProductItem } from '../mock/data';

export interface AdminOrderRecord {
  id: string;
  status: string;
  amount: number;
  createdAt: string;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    size: string;
    product?: {
      id: string;
      title: string;
      price: number;
      cover: string;
    };
  }>;
}

export function getAdminOverview() {
  return request<AdminOverview>('/admin/overview');
}

export function getAdminProducts() {
  return request<ProductItem[]>('/admin/products');
}

export function getAdminOrders() {
  return request<AdminOrderRecord[]>('/admin/orders');
}

export function getAdminFeedback() {
  return request<AdminFeedbackItem[]>('/admin/feedback');
}

export function updateAdminProduct(
  id: string,
  payload: Partial<Pick<ProductItem, 'saleStatus' | 'stock' | 'price'>>
) {
  return request<ProductItem>(`/admin/products/${id}`, {
    method: 'PATCH',
    data: payload
  });
}

export function updateAdminOrder(id: string, payload: { status: string }) {
  return request<AdminOrderRecord>(`/admin/orders/${id}/status`, {
    method: 'PATCH',
    data: payload
  });
}

export function updateAdminFeedback(id: string, payload: { status: AdminFeedbackItem['status'] }) {
  return request<AdminFeedbackItem>(`/admin/feedback/${id}/status`, {
    method: 'PATCH',
    data: payload
  });
}
