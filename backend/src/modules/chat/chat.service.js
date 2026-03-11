import { mockDb } from '../../data/mockDb.js';
import { askAi } from '../../integrations/ai/aiClient.js';

export const chatService = {
  createSession(userId, productId) {
    const product = mockDb.products.find((item) => item.id === productId);
    const session = {
      id: `chat_${Date.now()}`,
      userId,
      productId,
      title: product?.title || '商品咨询',
      messages: [
        {
          role: 'assistant',
          content: `你好，这里是 AI 购物助手，我已经拿到 ${product?.title || '当前商品'} 的上下文，可以直接问我尺码、材质、物流和售后问题。`
        }
      ]
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
        answer: '当前会话不存在，请重新进入商品页发起咨询。',
        messages: []
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
      answer: session.messages[session.messages.length - 1]?.content,
      messages: session.messages
    };
  },
  getHistory(userId) {
    return mockDb.chatSessions.filter((item) => item.userId === userId);
  }
};
