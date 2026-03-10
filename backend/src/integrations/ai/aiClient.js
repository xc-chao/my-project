import { aiConfig } from '../../config/ai.js';

export async function askAi({ question, productId }) {
  return {
    provider: aiConfig.provider,
    productId,
    answer: `当前为占位 AI 响应：已收到关于商品 ${productId} 的问题“${question}”。`
  };
}
