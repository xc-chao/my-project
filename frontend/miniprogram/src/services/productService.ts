import { request } from './request';
import type { ProductItem } from '../types/domain';
import type { ProductSearchQuery } from '../utils/product-search';

interface ProductListResponse {
  list: ProductItem[];
  categories: string[];
}

function buildProductQueryString(query: ProductSearchQuery = {}) {
  const params: string[] = [];

  function appendParam(key: string, value: string) {
    params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  }

  if (query.keyword?.trim()) {
    appendParam('keyword', query.keyword.trim());
  }

  if (query.sort && query.sort !== 'comprehensive') {
    appendParam('sort', query.sort);
  }

  if (query.scene) {
    appendParam('scene', query.scene);
  }

  if (query.category?.trim()) {
    appendParam('category', query.category.trim());
  }

  if (query.onSaleOnly) {
    appendParam('onSaleOnly', '1');
  }

  const queryString = params.join('&');
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
