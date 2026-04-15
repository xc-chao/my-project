import { request } from './request';
import type { ProductItem } from '../types/domain';
import type { ProductSearchQuery } from '../utils/product-search';

interface ProductListResponse {
  list: ProductItem[];
  categories: string[];
}

function buildProductQueryString(query: ProductSearchQuery = {}) {
  const params = new URLSearchParams();

  if (query.keyword?.trim()) {
    params.set('keyword', query.keyword.trim());
  }

  if (query.sort && query.sort !== 'comprehensive') {
    params.set('sort', query.sort);
  }

  if (query.scene) {
    params.set('scene', query.scene);
  }

  if (query.category?.trim()) {
    params.set('category', query.category.trim());
  }

  if (query.onSaleOnly) {
    params.set('onSaleOnly', '1');
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

export function getProductList(query: ProductSearchQuery = {}) {
  return request<ProductListResponse>(`/products${buildProductQueryString(query)}`);
}

export function getProductDetail(id: string) {
  return request<ProductItem | undefined>(`/products/${id}`);
}

export function searchProducts(keyword: string, query: Omit<ProductSearchQuery, 'keyword'> = {}) {
  return request<{
    keyword: string;
    list: ProductItem[];
  }>(`/search${buildProductQueryString({ ...query, keyword })}`);
}
