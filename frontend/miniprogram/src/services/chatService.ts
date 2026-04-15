import { request } from './request';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSession {
  id: string;
  productId: string;
  title: string;
  productCover?: string;
  messages: ChatMessage[];
}

export function createChatSession(productId: string) {
  return request<ChatSession>('/chat/sessions', {
    method: 'POST',
    data: {
      productId
    }
  });
}

export function sendChatMessage(sessionId: string, question: string) {
  return request<{
    sessionId: string;
    answer?: string;
    messages: ChatMessage[];
  }>('/chat/messages', {
    method: 'POST',
    data: {
      sessionId,
      question
    }
  });
}

export function getChatHistory() {
  return request<ChatSession[]>('/chat/history');
}
