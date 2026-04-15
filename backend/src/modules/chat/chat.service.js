import { AppError } from '../../common/errors/AppError.js';
import { askAi } from '../../integrations/ai/aiClient.js';
import { chatRepository } from './chat.repository.js';

export const chatService = {
  async createSession(userId, productId) {
    const product = await chatRepository.getProductContext(productId);

    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', '商品不存在');
    }

    return chatRepository.createSession(userId, product);
  },
  async sendMessage(userId, payload) {
    const session = await chatRepository.getSessionById(userId, payload.sessionId);

    if (!session) {
      return {
        sessionId: payload.sessionId,
        answer: '当前会话不存在，请重新进入商品页发起咨询。',
        messages: []
      };
    }

    await chatRepository.appendMessage(session.id, 'user', payload.question);
    const product = await chatRepository.getProductContext(session.productId);
    const aiResult = await askAi({
      question: payload.question,
      product
    });
    await chatRepository.appendMessage(session.id, 'assistant', aiResult.answer);
    const updatedSession = await chatRepository.getSessionById(userId, session.id);

    return {
      sessionId: session.id,
      answer: aiResult.answer,
      messages: updatedSession?.messages || []
    };
  },
  async getHistory(userId) {
    return chatRepository.listHistory(userId);
  }
};
