import { request } from './request';

export interface OrderPreviewResponse {
  address?: {
    id: string;
    name: string;
    phone: string;
    region: string;
    detail: string;
    isDefault: boolean;
  };
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
  summary: {
    goodsAmount: number;
    shippingFee: number;
    discountAmount: number;
    payableAmount: number;
  };
}

export function getOrderPreview() {
  return request<OrderPreviewResponse>('/orders/preview');
}

export function createOrder(payload: { addressId?: string; remark?: string }) {
  return request<{
    id: string;
    status: string;
    amount: number;
    createdAt: string;
  }>('/orders', {
    method: 'POST',
    data: payload
  });
}

export function getOrderList() {
  return request<
    Array<{
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
    }>
  >('/orders');
}
