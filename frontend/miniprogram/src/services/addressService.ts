import { request } from './request';

export interface AddressPayload {
  name: string;
  phone: string;
  region: string;
  detail: string;
  isDefault?: boolean;
}

export interface AddressItem extends AddressPayload {
  id: string;
  isDefault: boolean;
}

export function getAddressList() {
  return request<AddressItem[]>('/addresses');
}

export function createAddress(payload: AddressPayload) {
  return request<AddressItem[]>('/addresses', {
    method: 'POST',
    data: payload
  });
}

export function updateAddress(id: string, payload: AddressPayload) {
  return request<AddressItem[]>(`/addresses/${id}`, {
    method: 'PUT',
    data: payload
  });
}

export function deleteAddress(id: string) {
  return request<AddressItem[]>(`/addresses/${id}`, {
    method: 'DELETE'
  });
}
