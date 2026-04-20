import { feedbackRepository } from './feedback.repository.js';

export const feedbackService = {
  async listByProductId(productId) {
    return feedbackRepository.listByProductId(productId);
  },
  async create(userId, payload) {
    return feedbackRepository.create(userId, payload);
  }
};
