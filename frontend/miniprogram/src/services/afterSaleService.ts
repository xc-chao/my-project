import { request } from './request';

export interface AfterSaleItem {
  id: string;
  orderId: string;
  productTitle: string;
  reason: string;
  status: string;
}

export function getAfterSaleList() {
  return request<AfterSaleItem[]>('/after-sales');
}

export function createAfterSale(payload: {
  orderId: string;
  productTitle: string;
  reason: string;
}) {
  return request<AfterSaleItem>('/after-sales', {
    method: 'POST',
    data: payload
  });
}
