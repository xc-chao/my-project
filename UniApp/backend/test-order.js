// ==========================================
// 订单和支付模块快速测试脚本
// 使用方法：node test-order.js
// 前提：服务器已启动，数据库已初始化
// ==========================================

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let testToken = '';
let testOrderId = 0;
let testPaymentNo = '';

console.log('🧪 开始测试订单和支付模块...\n');
console.log('='.repeat(50));

async function runTests() {
  try {
    // ==========================================
    // 准备工作：登录并添加商品到购物车
    // ==========================================
    console.log('\n📝 准备：登录并添加商品到购物车');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      phone: '13800138001',
      password: '123456'
    });
    testToken = loginRes.data.data.token;
    console.log('✅ 登录成功（用户: 张三）');

    const headers = {
      'Authorization': `Bearer ${testToken}`,
      'Content-Type': 'application/json'
    };

    // 清空购物车
    await axios.delete(`${BASE_URL}/cart`, { headers });

    // 添加商品到购物车
    await axios.post(`${BASE_URL}/cart`, { productId: 1, quantity: 2 }, { headers });
    await axios.post(`${BASE_URL}/cart`, { productId: 11, quantity: 1 }, { headers });
    await axios.post(`${BASE_URL}/cart`, { productId: 21, quantity: 1 }, { headers });
    console.log('✅ 已添加 3 个商品到购物车');

    // ==========================================
    // 测试 1：创建订单
    // ==========================================
    console.log('\n📝 测试 1: 从购物车创建订单');
    try {
      const orderRes = await axios.post(`${BASE_URL}/orders`, {}, { headers });
      testOrderId = orderRes.data.data.id;
      console.log('✅ 订单创建成功');
      console.log('   订单号:', orderRes.data.data.orderNo);
      console.log('   订单ID:', orderRes.data.data.id);
      console.log('   总金额: ¥', orderRes.data.data.totalAmount);
      console.log('   商品数量:', orderRes.data.data.orderItems.length);
      console.log('   订单状态:', getStatusText(orderRes.data.data.status));
    } catch (err) {
      console.error('❌ 创建订单失败:', err.response?.data?.message);
      return;
    }

    // ==========================================
    // 测试 2：获取订单列表
    // ==========================================
    console.log('\n📝 测试 2: 获取订单列表');
    try {
      const listRes = await axios.get(`${BASE_URL}/orders?page=1&pageSize=10`, { headers });
      console.log('✅ 获取成功');
      console.log('   订单总数:', listRes.data.data.pagination.total);
      console.log('   当前页:', listRes.data.data.pagination.page);
      console.log('   总页数:', listRes.data.data.pagination.totalPages);
    } catch (err) {
      console.error('❌ 获取失败:', err.response?.data?.message);
    }

    // ==========================================
    // 测试 3：获取订单详情
    // ==========================================
    console.log('\n📝 测试 3: 获取订单详情');
    try {
      const detailRes = await axios.get(`${BASE_URL}/orders/${testOrderId}`, { headers });
      console.log('✅ 获取成功');
      console.log('   订单号:', detailRes.data.data.orderNo);
      console.log('   商品明细:');
      detailRes.data.data.orderItems.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.product.name} x${item.quantity} = ¥${item.subtotal}`);
      });
    } catch (err) {
      console.error('❌ 获取失败:', err.response?.data?.message);
    }

    // ==========================================
    // 测试 4：获取订单统计
    // ==========================================
    console.log('\n📝 测试 4: 获取订单统计');
    try {
      const statsRes = await axios.get(`${BASE_URL}/orders/stats`, { headers });
      console.log('✅ 获取成功');
      console.log('   待支付:', statsRes.data.data.pending);
      console.log('   已支付:', statsRes.data.data.paid);
      console.log('   已取消:', statsRes.data.data.cancelled);
      console.log('   已完成:', statsRes.data.data.completed);
      console.log('   总订单数:', statsRes.data.data.total);
    } catch (err) {
      console.error('❌ 获取失败:', err.response?.data?.message);
    }

    // ==========================================
    // 测试 5：创建支付（微信支付）
    // ==========================================
    console.log('\n📝 测试 5: 创建微信支付订单');
    try {
      const payRes = await axios.post(`${BASE_URL}/payments/create`, {
        orderId: testOrderId,
        paymentMethod: 'wechat'
      }, { headers });
      testPaymentNo = payRes.data.data.paymentNo;
      console.log('✅ 支付订单创建成功');
      console.log('   支付流水号:', payRes.data.data.paymentNo);
      console.log('   支付方式:', payRes.data.data.paymentMethod);
      console.log('   微信支付参数:', JSON.stringify(payRes.data.data.paymentParams, null, 2));
    } catch (err) {
      console.error('❌ 创建支付失败:', err.response?.data?.message);
    }

    // ==========================================
    // 测试 6：模拟支付成功
    // ==========================================
    console.log('\n📝 测试 6: 模拟支付成功（开发环境）');
    try {
      const mockPayRes = await axios.post(`${BASE_URL}/payments/mock-pay`, {
        paymentNo: testPaymentNo
      }, { headers });
      console.log('✅ 支付成功');
      console.log('   订单号:', mockPayRes.data.data.orderNo);
      console.log('   支付金额: ¥', mockPayRes.data.data.amount);
      console.log('   支付时间:', mockPayRes.data.data.paidAt);
    } catch (err) {
      console.error('❌ 支付失败:', err.response?.data?.message);
    }

    // ==========================================
    // 测试 7：查询支付状态
    // ==========================================
    console.log('\n📝 测试 7: 查询支付状态');
    try {
      const statusRes = await axios.get(`${BASE_URL}/payments/${testPaymentNo}`, { headers });
      console.log('✅ 查询成功');
      console.log('   支付状态:', getPaymentStatusText(statusRes.data.data.status));
      console.log('   交易号:', statusRes.data.data.transactionId);
    } catch (err) {
      console.error('❌ 查询失败:', err.response?.data?.message);
    }

    // ==========================================
    // 测试 8：验证订单状态已更新
    // ==========================================
    console.log('\n📝 测试 8: 验证订单状态已更新');
    try {
      const orderRes = await axios.get(`${BASE_URL}/orders/${testOrderId}`, { headers });
      console.log('✅ 订单状态已更新');
      console.log('   状态:', getStatusText(orderRes.data.data.status));
      console.log('   支付方式:', orderRes.data.data.paymentMethod);
      console.log('   支付时间:', orderRes.data.data.paidAt);
    } catch (err) {
      console.error('❌ 查询失败:', err.response?.data?.message);
    }

    // ==========================================
    // 测试 9：余额支付流程
    // ==========================================
    console.log('\n📝 测试 9: 测试余额支付流程');
    
    // 9.1 添加商品到购物车
    await axios.post(`${BASE_URL}/cart`, { productId: 2, quantity: 1 }, { headers });
    
    // 9.2 创建订单
    const order2Res = await axios.post(`${BASE_URL}/orders`, {}, { headers });
    const order2Id = order2Res.data.data.id;
    console.log('✅ 订单创建成功（订单2）');
    console.log('   订单号:', order2Res.data.data.orderNo);
    console.log('   金额: ¥', order2Res.data.data.totalAmount);

    // 9.3 余额支付
    try {
      const balancePayRes = await axios.post(`${BASE_URL}/payments/create`, {
        orderId: order2Id,
        paymentMethod: 'balance'
      }, { headers });
      console.log('✅ 余额支付成功');
      console.log('   支付流水号:', balancePayRes.data.data.paymentNo);
    } catch (err) {
      console.error('❌ 余额支付失败:', err.response?.data?.message);
    }

    // ==========================================
    // 测试 10：取消订单
    // ==========================================
    console.log('\n📝 测试 10: 取消未支付的订单');
    
    // 10.1 创建一个新订单
    await axios.post(`${BASE_URL}/cart`, { productId: 3, quantity: 1 }, { headers });
    const order3Res = await axios.post(`${BASE_URL}/orders`, {}, { headers });
    const order3Id = order3Res.data.data.id;
    console.log('✅ 订单创建成功（订单3）');

    // 10.2 取消订单
    try {
      await axios.put(`${BASE_URL}/orders/${order3Id}/cancel`, {}, { headers });
      console.log('✅ 订单取消成功');
      console.log('   库存已回滚');
    } catch (err) {
      console.error('❌ 取消失败:', err.response?.data?.message);
    }

    // ==========================================
    // 测试 11：尝试取消已支付的订单（应该失败）
    // ==========================================
    console.log('\n📝 测试 11: 尝试取消已支付的订单');
    try {
      await axios.put(`${BASE_URL}/orders/${testOrderId}/cancel`, {}, { headers });
      console.log('❌ 应该返回错误，但成功了');
    } catch (err) {
      if (err.response?.data?.code === 1301) {
        console.log('✅ 正确拦截（错误码 1301：订单已支付）');
      } else {
        console.error('❌ 返回了意外的错误:', err.response?.data);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 订单和支付模块测试完成！');
    console.log('='.repeat(50));

  } catch (err) {
    console.error('\n❌ 测试过程中出现异常:', err.message);
  }
}

// 辅助函数
function getStatusText(status) {
  const statusMap = {
    0: '待支付',
    1: '已支付',
    2: '已取消',
    3: '已完成'
  };
  return statusMap[status] || '未知';
}

function getPaymentStatusText(status) {
  const statusMap = {
    0: '待支付',
    1: '已支付',
    2: '已退款',
    3: '已关闭'
  };
  return statusMap[status] || '未知';
}

// 运行测试
runTests();

