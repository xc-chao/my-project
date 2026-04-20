import { aiConfig } from '../../config/ai.js';
import { env } from '../../config/env.js';
import { logger } from '../../common/logger/logger.js';
import { query } from '../../config/db.js';
import { createId } from '../../common/utils/id.js';

function buildFallbackAnswer({ question, product }) {
  if (!product) {
    return '抱歉，当前网络不太稳定，暂时无法为你查询。你可以稍后再试，或者换个问题我来帮你看看。';
  }

  const parts = [`关于「${product.title}」`];

  if (product.shipWithinHours) {
    parts.push(`发货时效约 ${product.shipWithinHours} 小时`);
  }
  if (product.sizes?.length) {
    parts.push(`可选规格：${product.sizes.join('、')}`);
  }
  if (product.serviceTags?.length) {
    parts.push(`服务保障：${product.serviceTags.join('、')}`);
  }

  parts.push('如果你想了解更多细节，可以试试问我尺码推荐、材质详情或售后政策。');

  return parts.join('，');
}

function buildProductPrompt(product) {
  const role = [
    '## 角色',
    '你是一位专业、热情的电商导购助手，服务于一款购物小程序。',
    '你的核心职责是帮助用户做出满意的购买决策，同时提供愉快的对话体验。',
    '',
    '## 性格',
    '- 专业但不生硬，像一位懂行的朋友在给建议',
    '- 诚实守信，不确定的信息会如实说明，绝不编造',
    '- 有耐心，用户重复提问也保持友好',
    '- 适度热情，不过度推销'
  ].join('\n');

  const rules = [
    '',
    '## 回答规范',
    '- 语言：中文',
    '- 长度：80~200 字，复杂问题可适当延长但不超过 300 字',
    '- 结构：先给结论，再给理由，必要时分点说明',
    '- 语气：口语化、亲切自然，避免机械感',
    '- 禁止编造商品参数、价格、库存等事实性信息',
    '- 如果商品信息中没有用户问的内容，诚实回答「这个信息商品页暂未提供，建议联系商家客服确认」'
  ].join('\n');

  const boundaries = [
    '',
    '## 话题边界',
    '- 用户提问与当前商品相关：正常回答，充分利用下方商品信息',
    '- 用户提问与购物/电商相关但不涉及当前商品（如比价、其他品牌推荐）：简要回应，然后自然引导回当前商品',
    '- 用户闲聊或提问完全无关话题（如天气、新闻、写代码）：礼貌说明「我是这款商品的专属导购助手，这个问题可能帮不上忙，不过关于这款商品的任何疑问我都很在行，随时问我~」',
    '- 用户发送不当内容：不回应具体内容，温和引导回购物话题'
  ].join('\n');

  if (!product) {
    return [
      role,
      rules,
      boundaries,
      '',
      '## 当前状态',
      '当前没有绑定具体商品，请作为通用电商导购助手回答用户的购物相关问题。',
      '如果用户问到具体商品信息，引导用户从商品详情页进入咨询。'
    ].join('\n');
  }

  const productInfo = [
    '',
    '## 当前商品信息（以下为事实，回答时据此作答）',
    `- 商品标题：${product.title}`,
    `- 副标题：${product.subtitle || '无'}`,
    `- 分类：${product.category || '未分类'}`,
    `- 价格：¥${product.price || 0}`,
    `- 商品卖点：${product.detail || '无'}`,
    `- 商品徽标：${product.badges?.join('、') || '无'}`,
    `- 可选尺码/规格：${product.sizes?.join('、') || '无'}`,
    `- 服务保障：${product.serviceTags?.join('、') || '无'}`,
    `- 好评率：${product.praiseRate || 0}%`,
    `- 发货时效：${product.shipWithinHours ? product.shipWithinHours + ' 小时内发货' : '未标注'}`
  ].join('\n');

  return [role, rules, boundaries, productInfo].join('\n');
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
