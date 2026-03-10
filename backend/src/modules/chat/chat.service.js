import { mockDb } from '../../data/mockDb.js';
import { askAi } from '../../integrations/ai/aiClient.js';

export const chatService = {
  createSession(userId, productId) {
    const session = {
      id: `chat_${Date.now()}`,
      userId,
      productId,
      messages: []
    };

    mockDb.chatSessions.unshift(session);
    return session;
  },
  async sendMessage(userId, payload) {
    const session = mockDb.chatSessions.find(
      (item) => item.id === payload.sessionId && item.userId === userId
    );

    if (!session) {
      return {
        sessionId: payload.sessionId,
        answer: '当前会话不存在，请重新进入商品页发起咨询。'
      };
    }

    session.messages.push({
      role: 'user',
      content: payload.question
    });
    const aiResult = await askAi({
      question: payload.question,
      productId: session.productId
    });

    session.messages.push({
      role: 'assistant',
      content: aiResult.answer
    });

    return {
      sessionId: session.id,
      answer: session.messages.at(-1)?.content
    };
  },
  getHistory(userId) {
    return mockDb.chatSessions.filter((item) => item.userId === userId);
  }
};
