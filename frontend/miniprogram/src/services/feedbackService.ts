import { request } from './request';

export interface FeedbackItem {
  id: string;
  userName: string;
  summary: string;
  createdAt: string;
}

export interface FeedbackPayload {
  productId: string;
  productTitle: string;
  summary: string;
}

export function getProductFeedbacks(productId: string) {
  return request<FeedbackItem[]>(`/feedback?productId=${productId}`);
}

export function submitFeedback(payload: FeedbackPayload) {
  return request<{ id: string }>('/feedback', {
    method: 'POST',
    data: payload
  });
}
