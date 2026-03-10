import { request } from './request';
import type { ProductItem } from '../mock/data';

interface ProductListResponse {
  list: ProductItem[];
  categories: string[];
}

export function getProductList() {
  return request<ProductListResponse>('/products');
}

export function getProductDetail(id: string) {
  return request<ProductItem | undefined>(`/products/${id}`);
}

export function searchProducts(keyword: string) {
  return request<{
    keyword: string;
    list: ProductItem[];
  }>(`/search?keyword=${encodeURIComponent(keyword)}`);
}
