import {
  mockAddresses,
  mockAfterSales,
  mockCart,
  mockCategories,
  mockOrders,
  mockProducts,
  mockUser
} from './data';

const mockChatSessions: Array<{
  id: string;
  productId: string;
  title: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}> = [];

interface MockRequest {
  method: string;
  url: string;
  data?: Record<string, any>;
}

function success(data: unknown, message = 'ok') {
  return {
    success: true,
    message,
    data
  };
}

function getCartPayload() {
  const list = mockCart.map((item) => {
    const product = mockProducts.find((productItem) => productItem.id === item.productId);

    return {
      ...item,
      product
    };
  });

  return {
    list,
    totalCount: list.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: list.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0)
  };
}

function getOrderPayload() {
  return mockOrders.map((order) => {
    return {
      ...order,
      items: order.items.map((item) => {
        return {
          ...item,
          product: mockProducts.find((productItem) => productItem.id === item.productId)
        };
      })
    };
  });
}

export function handleMockRequest({ method, url, data = {} }: MockRequest) {
  if (method === 'POST' && url === '/auth/wechat-login') {
    return success(
      {
        user: mockUser,
        accessToken: 'mock_access_token'
      },
      '登录成功'
    );
  }

  if (method === 'GET' && url === '/products') {
    return success({
      list: mockProducts,
      categories: mockCategories
    });
  }

  if (method === 'GET' && url.startsWith('/search')) {
    const keyword = decodeURIComponent((url.split('keyword=')[1] || '').trim()).toLowerCase();
    const list = mockProducts.filter((item) => {
      return (
        item.title.toLowerCase().includes(keyword) ||
        item.subtitle.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword)
      );
    });

    return success({
      keyword,
      list
    });
  }

  if (method === 'GET' && url.startsWith('/products/')) {
    const id = url.split('/').pop();
    return success(mockProducts.find((item) => item.id === id));
  }

  if (method === 'GET' && url === '/cart') {
    return success(getCartPayload());
  }

  if (method === 'GET' && url === '/orders/preview') {
    const cart = getCartPayload();
    const address = mockAddresses.find((item) => item.isDefault) || mockAddresses[0];

    return success({
      address,
      items: cart.list,
      summary: {
        goodsAmount: cart.totalAmount,
        shippingFee: cart.list.length ? 12 : 0,
        discountAmount: cart.list.length ? 20 : 0,
        payableAmount: Math.max(cart.totalAmount + (cart.list.length ? 12 : 0) - (cart.list.length ? 20 : 0), 0)
      }
    });
  }

  if (method === 'POST' && url === '/cart/items') {
    const existing = mockCart.find(
      (item) => item.productId === data.productId && item.size === data.size
    );

    if (existing) {
      existing.quantity += data.quantity;
    } else {
      mockCart.unshift({
        id: `cart_${Date.now()}`,
        productId: data.productId,
        quantity: data.quantity,
        size: data.size
      });
    }

    return success(getCartPayload(), '已加入购物车');
  }

  if (method === 'PATCH' && /^\/cart\/items\/.+/.test(url)) {
    const id = url.split('/').pop();
    const item = mockCart.find((cartItem) => cartItem.id === id);

    if (item) {
      item.quantity = data.quantity;
    }

    return success(getCartPayload(), '购物车已更新');
  }

  if (method === 'DELETE' && /^\/cart\/items\/.+/.test(url)) {
    const id = url.split('/').pop();
    const index = mockCart.findIndex((cartItem) => cartItem.id === id);

    if (index > -1) {
      mockCart.splice(index, 1);
    }

    return success(getCartPayload(), '已移除商品');
  }

  if (method === 'POST' && url === '/orders') {
    const cart = getCartPayload();
    const payableAmount = Math.max(cart.totalAmount + (cart.list.length ? 12 : 0) - (cart.list.length ? 20 : 0), 0);

    const newOrder = {
      id: `order_${Date.now()}`,
      status: 'pending_payment' as const,
      amount: payableAmount,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
      items: mockCart.map((item) => ({ ...item }))
    };

    mockOrders.unshift(newOrder);
    mockCart.splice(0, mockCart.length);

    return success(newOrder, '订单已创建');
  }

  if (method === 'GET' && url === '/orders') {
    return success(getOrderPayload());
  }

  if (method === 'GET' && /^\/orders\/.+/.test(url)) {
    const id = url.split('/').pop();
    return success(getOrderPayload().find((item) => item.id === id));
  }

  if (method === 'GET' && url === '/addresses') {
    return success(mockAddresses);
  }

  if (method === 'POST' && url === '/addresses') {
    const created = {
      id: `addr_${Date.now()}`,
      name: data.name,
      phone: data.phone,
      region: data.region,
      detail: data.detail,
      isDefault: Boolean(data.isDefault)
    };

    if (created.isDefault) {
      mockAddresses.forEach((item) => {
        item.isDefault = false;
      });
    }

    mockAddresses.unshift(created);
    return success(mockAddresses, '地址已新增');
  }

  if (method === 'PUT' && /^\/addresses\/.+/.test(url)) {
    const id = url.split('/').pop();
    const target = mockAddresses.find((item) => item.id === id);

    if (target) {
      if (data.isDefault) {
        mockAddresses.forEach((item) => {
          item.isDefault = false;
        });
      }

      target.name = data.name;
      target.phone = data.phone;
      target.region = data.region;
      target.detail = data.detail;
      target.isDefault = Boolean(data.isDefault);
    }

    return success(mockAddresses, '地址已更新');
  }

  if (method === 'DELETE' && /^\/addresses\/.+/.test(url)) {
    const id = url.split('/').pop();
    const index = mockAddresses.findIndex((item) => item.id === id);

    if (index > -1) {
      mockAddresses.splice(index, 1);
    }

    return success(mockAddresses, '地址已删除');
  }

  if (method === 'GET' && url === '/after-sales') {
    return success(mockAfterSales);
  }

  if (method === 'POST' && url === '/after-sales') {
    const created = {
      id: `after_${Date.now()}`,
      orderId: data.orderId,
      productTitle: data.productTitle,
      reason: data.reason,
      status: 'submitted' as const
    };

    mockAfterSales.unshift(created);
    return success(created, '售后申请已提交');
  }

  if (method === 'POST' && url === '/chat/sessions') {
    const product = mockProducts.find((item) => item.id === data.productId);
    const session = {
      id: `chat_${Date.now()}`,
      productId: data.productId,
      title: product?.title || '商品咨询',
      messages: [
        {
          role: 'assistant' as const,
          content: `你好，这里是 AI 购物助手，我已经拿到 ${product?.title || '当前商品'} 的上下文，可以直接问我尺码、材质、物流和售后问题。`
        }
      ]
    };

    mockChatSessions.unshift(session);
    return success(session, '会话已创建');
  }

  if (method === 'POST' && url === '/chat/messages') {
    const session = mockChatSessions.find((item) => item.id === data.sessionId);

    if (!session) {
      throw new Error('聊天会话不存在');
    }

    session.messages.push({
      role: 'user',
      content: data.question
    });
    session.messages.push({
      role: 'assistant',
      content: `结合当前商品信息，建议你重点关注「${session.title}」的尺码、库存和售后政策。这是首轮 mock AI 回复。`
    });

    return success({
      sessionId: session.id,
      answer: session.messages[session.messages.length - 1]?.content,
      messages: session.messages
    });
  }

  if (method === 'GET' && url === '/chat/history') {
    return success(mockChatSessions);
  }

  throw new Error(`未实现的 mock 接口: ${method} ${url}`);
}
