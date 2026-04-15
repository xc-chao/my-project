import { request } from './request';
import type { AdminFeedbackItem, AdminOverview, ProductItem } from '../types/domain';

export interface AdminOrderRecord {
  id: string;
  status: string;
  amount: number;
  createdAt: string;
  logistics?: {
    carrier: string;
    trackingNo: string;
    updatedAt: string;
  } | null;
  timeline?: Array<{
    id: string;
    time: string;
    title: string;
    desc: string;
  }>;
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

export interface AdminAfterSaleRecord {
  id: string;
  orderId: string;
  productTitle: string;
  reason: string;
  status: 'submitted' | 'reviewing' | 'approved' | 'rejected';
  userName: string;
  createdAt: string;
}

export interface AdminProductPayload {
  title: string;
  subtitle: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  cover: string;
  badges: string[];
  sizes: string[];
  detail: string;
  gallery: string[];
  saleStatus: 'on_sale' | 'off_shelf';
}

export function getAdminOverview() {
  return request<AdminOverview>('/admin/overview');
}

export function getAdminProducts() {
  return request<ProductItem[]>('/admin/products');
}

export function getAdminProductDetail(id: string) {
  return request<ProductItem>(`/admin/products/${id}`);
}

export function getAdminOrders() {
  return request<AdminOrderRecord[]>('/admin/orders');
}

export function getAdminOrderDetail(id: string) {
  return request<AdminOrderRecord>(`/admin/orders/${id}`);
}

export function getAdminFeedback() {
  return request<AdminFeedbackItem[]>('/admin/feedback');
}

export function getAdminAfterSales(orderId?: string) {
  const query = orderId ? `?orderId=${encodeURIComponent(orderId)}` : '';
  return request<AdminAfterSaleRecord[]>(`/admin/after-sales${query}`);
}

export function createAdminProduct(payload: AdminProductPayload) {
  return request<ProductItem>('/admin/products', {
    method: 'POST',
    data: payload
  });
}

export function updateAdminProduct(
  id: string,
  payload: Partial<AdminProductPayload>
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

export function updateAdminOrderLogistics(
  id: string,
  payload: {
    carrier: string;
    trackingNo: string;
  }
) {
  return request<AdminOrderRecord>(`/admin/orders/${id}/logistics`, {
    method: 'PATCH',
    data: payload
  });
}

export function updateAdminAfterSale(
  id: string,
  payload: { status: AdminAfterSaleRecord['status'] }
) {
  return request<AdminAfterSaleRecord>(`/admin/after-sales/${id}/status`, {
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
