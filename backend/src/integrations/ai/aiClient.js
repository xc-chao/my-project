import { aiConfig } from '../../config/ai.js';
import { env } from '../../config/env.js';
import { logger } from '../../common/logger/logger.js';
import { query } from '../../config/db.js';
import { createId } from '../../common/utils/id.js';

function buildFallbackAnswer({ question, product }) {
  const shipText = product?.shipWithinHours ? `${product.shipWithinHours} 小时内可发货` : '发货时效需以商家页面为准';
  const sizeText = product?.sizes?.length ? `可选尺码/规格：${product.sizes.join('、')}` : '可选尺码信息建议回到商品页进一步确认';
  const serviceText = product?.serviceTags?.length ? product.serviceTags.join('、') : '支持常见售后与配送咨询';

  return `我先基于当前商品信息给你一个参考答复：关于“${question}”，${product?.title || '当前商品'}目前${shipText}，${sizeText}，并且 ${serviceText}。如果你想更精准，我也可以继续按“尺码建议 / 材质说明 / 发货售后”任一方向细问。`;
}

function buildProductPrompt(product) {
  if (!product) {
    return '当前没有商品上下文，请作为电商导购助手，简洁回答用户问题。';
  }

  return [
    '你是电商小程序里的商品导购助手，请只围绕当前商品回答。',
    '回答风格要求：中文、简洁、具体、避免编造、长度控制在 80~160 字。',
    `商品标题：${product.title}`,
    `商品副标题：${product.subtitle || '无'}`,
    `商品分类：${product.category || '未分类'}`,
    `商品价格：¥${product.price || 0}`,
    `商品卖点：${product.detail || '无'}`,
    `商品徽标：${product.badges?.join('、') || '无'}`,
    `可选尺码：${product.sizes?.join('、') || '无'}`,
    `服务标签：${product.serviceTags?.join('、') || '无'}`,
    `好评率：${product.praiseRate || 0}%`,
    `发货时效：${product.shipWithinHours || 0} 小时`
  ].join('\n');
}

function getProviderConfig() {
  if (aiConfig.provider === 'ark') {
    return {
      url: `${env.arkBaseUrl.replace(/\/$/, '')}/chat/completions`,
      model: env.arkModel,
      apiKey: env.arkApiKey
    };
  }

  if (aiConfig.provider === 'openai') {
    return {
      url: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-4o-mini',
      apiKey: env.openAiApiKey
    };
  }

  return {
    url: 'https://api.deepseek.com/chat/completions',
    model: 'deepseek-chat',
    apiKey: env.deepseekApiKey
  };
}

async function recordAiCallLog({ provider, model, success, fallbackUsed, latencyMs, errorMessage = null }) {
  try {
    await query(
      `
        INSERT INTO ai_call_logs (
          id,
          provider,
          model,
          success,
          fallback_used,
          latency_ms,
          error_message
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        createId('ai_log'),
        provider,
        model,
        success ? 1 : 0,
        fallbackUsed ? 1 : 0,
        latencyMs,
        errorMessage
      ]
    );
  } catch (error) {
    logger.warn('AI log write failed', {
      provider,
      message: error instanceof Error ? error.message : String(error)
    });
  }
}

export async function askAi({ question, product }) {
  const fallbackAnswer = buildFallbackAnswer({ question, product });
  const providerConfig = getProviderConfig();
  const startedAt = Date.now();

  if (!providerConfig.apiKey) {
    await recordAiCallLog({
      provider: aiConfig.provider,
      model: providerConfig.model,
      success: false,
      fallbackUsed: true,
      latencyMs: Date.now() - startedAt,
      errorMessage: 'missing_api_key'
    });

    return {
      provider: aiConfig.provider,
      answer: fallbackAnswer
    };
  }

  try {
    const response = await fetch(providerConfig.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${providerConfig.apiKey}`
      },
      body: JSON.stringify({
        model: providerConfig.model,
        temperature: 0.4,
        messages: [
          {
            role: 'system',
            content: buildProductPrompt(product)
          },
          {
            role: 'user',
            content: question
          }
        ]
      }),
      signal: AbortSignal.timeout(aiConfig.timeoutMs)
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload?.error?.message || payload?.message || `AI request failed: ${response.status}`);
    }

    const answer = payload?.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      throw new Error('AI returned empty answer');
    }

    await recordAiCallLog({
      provider: aiConfig.provider,
      model: providerConfig.model,
      success: true,
      fallbackUsed: false,
      latencyMs: Date.now() - startedAt
    });

    return {
      provider: aiConfig.provider,
      answer
    };
  } catch (error) {
    await recordAiCallLog({
      provider: aiConfig.provider,
      model: providerConfig.model,
      success: false,
      fallbackUsed: true,
      latencyMs: Date.now() - startedAt,
      errorMessage: error instanceof Error ? error.message.slice(0, 255) : String(error).slice(0, 255)
    });
    logger.warn('AI request failed, fallback to local answer', {
      provider: aiConfig.provider,
      message: error instanceof Error ? error.message : String(error)
    });

    return {
      provider: aiConfig.provider,
      answer: fallbackAnswer
    };
  }
}
