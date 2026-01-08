// ==========================================
// 支付控制器（PaymentController）
// 功能：处理微信支付相关的业务逻辑
// ==========================================

const crypto = require('crypto');
const { sequelize, Order, Payment, User, OrderItem, Product } = require('../models');
const { success, error } = require('../utils/response');
const ErrorCodes = require('../constants/errorCodes');

/**
 * 创建支付订单（微信支付统一下单）
 * 路由：POST /api/payments/create
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 1. 验证订单状态
 * 2. 创建支付记录
 * 3. 调用微信支付统一下单 API
 * 4. 返回支付参数给前端
 * 
 * 请求参数：
 * @body {number} orderId - 订单ID
 * @body {string} paymentMethod - 支付方式（wechat/balance）
 * 
 * 返回数据：
 * @returns {Object} { code: 200, data: { paymentParams, paymentNo } }
 */
exports.createPayment = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { orderId, paymentMethod = 'wechat' } = req.body;
    const userId = req.userId;

    // 验证参数
    if (!orderId) {
      await t.rollback();
      return error(res, ErrorCodes.BAD_REQUEST, '订单ID不能为空');
    }

    // ========== 1. 查询订单 ==========
    const order = await Order.findOne({
      where: { id: orderId, userId },
      transaction: t
    });

    if (!order) {
      await t.rollback();
      return error(res, ErrorCodes.ORDER_NOT_FOUND);
    }

    // 验证订单状态
    if (order.status === 1) {
      await t.rollback();
      return error(res, ErrorCodes.ORDER_ALREADY_PAID);
    }

    if (order.status === 2) {
      await t.rollback();
      return error(res, ErrorCodes.ORDER_ALREADY_CANCELLED);
    }

    // ========== 2. 余额支付 ==========
    if (paymentMethod === 'balance') {
      const user = await User.findByPk(userId, { transaction: t });
      
      // 验证余额是否充足
      if (user.balance < order.totalAmount) {
        await t.rollback();
        return error(res, ErrorCodes.USER_BALANCE_INSUFFICIENT, 
          `余额不足，当前余额：¥${user.balance}`);
      }

      // 扣除余额
      user.balance -= order.totalAmount;
      await user.save({ transaction: t });

      // 生成支付流水号
      const paymentNo = 'PAY' + Date.now() + Math.floor(Math.random() * 10000);

      // 创建支付记录
      await Payment.create({
        orderId: order.id,
        paymentNo,
        transactionId: null,
        paymentMethod: 'balance',
        amount: order.totalAmount,
        status: 1, // 已支付
        paidAt: new Date()
      }, { transaction: t });

      // 更新订单状态
      order.status = 1; // 已支付
      order.paymentMethod = 'balance';
      order.paidAt = new Date();
      await order.save({ transaction: t });

      await t.commit();

      return success(res, {
        paymentMethod: 'balance',
        paymentNo,
        order: {
          id: order.id,
          orderNo: order.orderNo,
          totalAmount: order.totalAmount,
          status: order.status
        }
      }, '支付成功');
    }

    // ========== 3. 微信支付 ==========
    if (paymentMethod === 'wechat') {
      // 生成支付流水号
      const paymentNo = 'PAY' + Date.now() + Math.floor(Math.random() * 10000);

      // 创建支付记录
      const payment = await Payment.create({
        orderId: order.id,
        paymentNo,
        transactionId: null,
        paymentMethod: 'wechat',
        amount: order.totalAmount,
        status: 0, // 待支付
        paidAt: null
      }, { transaction: t });

      await t.commit();

      // ========== 调用微信支付统一下单 API ==========
      // 真实环境需要调用微信 API
      const paymentParams = await generateWechatPaymentParams(order, payment);

      return success(res, {
        paymentMethod: 'wechat',
        paymentNo: payment.paymentNo,
        paymentParams, // 微信支付参数
        order: {
          id: order.id,
          orderNo: order.orderNo,
          totalAmount: order.totalAmount
        }
      }, '支付订单创建成功');
    }

    await t.rollback();
    return error(res, ErrorCodes.BAD_REQUEST, '不支持的支付方式');

  } catch (err) {
    await t.rollback();
    console.error('创建支付失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 微信支付回调通知
 * 路由：POST /api/payments/callback
 * 权限：无需认证（微信服务器回调）
 * 
 * 功能说明：
 * 1. 验证微信签名
 * 2. 解析支付结果
 * 3. 更新支付记录
 * 4. 更新订单状态
 * 
 * 微信回调参数：
 * @body {Object} - 微信支付结果通知
 * 
 * 返回数据：
 * @returns {string} XML 格式的响应
 */
exports.wechatPaymentCallback = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    // ========== 1. 解析微信回调数据 ==========
    // 真实环境需要解析 XML 格式的数据
    const {
      out_trade_no,    // 商户订单号（paymentNo）
      transaction_id,  // 微信支付订单号
      total_fee,       // 支付金额（分）
      result_code      // 支付结果：SUCCESS/FAIL
    } = req.body;

    console.log('收到微信支付回调:', req.body);

    // ========== 2. 验证签名（重要）==========
    // const isValid = verifyWechatSign(req.body);
    // if (!isValid) {
    //   return res.send(buildWechatResponse('FAIL', '签名验证失败'));
    // }

    // ========== 3. 查询支付记录 ==========
    const payment = await Payment.findOne({
      where: { paymentNo: out_trade_no },
      include: [{
        model: Order,
        as: 'order'
      }],
      transaction: t
    });

    if (!payment) {
      await t.rollback();
      return res.send(buildWechatResponse('FAIL', '支付记录不存在'));
    }

    // 如果已经处理过，直接返回成功
    if (payment.status === 1) {
      await t.rollback();
      return res.send(buildWechatResponse('SUCCESS', 'OK'));
    }

    // ========== 4. 支付成功，更新状态 ==========
    if (result_code === 'SUCCESS') {
      // 更新支付记录
      payment.status = 1; // 已支付
      payment.transactionId = transaction_id;
      payment.paidAt = new Date();
      await payment.save({ transaction: t });

      // 更新订单状态
      const order = payment.order;
      order.status = 1; // 已支付
      order.paymentMethod = 'wechat';
      order.paidAt = new Date();
      await order.save({ transaction: t });

      await t.commit();

      return res.send(buildWechatResponse('SUCCESS', 'OK'));
    } else {
      // 支付失败
      payment.status = 3; // 已关闭
      await payment.save({ transaction: t });

      await t.commit();

      return res.send(buildWechatResponse('FAIL', '支付失败'));
    }

  } catch (err) {
    await t.rollback();
    console.error('处理微信支付回调失败:', err);
    return res.send(buildWechatResponse('FAIL', '处理失败'));
  }
};

/**
 * 模拟微信支付（开发环境）
 * 路由：POST /api/payments/mock-pay
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 模拟微信支付成功，用于开发测试
 * 
 * 请求参数：
 * @body {string} paymentNo - 支付流水号
 * 
 * 返回数据：
 * @returns {Object} { code: 200, message: '支付成功' }
 */
exports.mockPay = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { paymentNo } = req.body;
    const userId = req.userId;

    if (!paymentNo) {
      await t.rollback();
      return error(res, ErrorCodes.BAD_REQUEST, '支付流水号不能为空');
    }

    // 查询支付记录
    const payment = await Payment.findOne({
      where: { paymentNo },
      include: [{
        model: Order,
        as: 'order'
      }],
      transaction: t
    });

    if (!payment) {
      await t.rollback();
      return error(res, ErrorCodes.BAD_REQUEST, '支付记录不存在');
    }

    // 验证订单所属
    if (payment.order.userId !== userId) {
      await t.rollback();
      return error(res, ErrorCodes.FORBIDDEN, '无权操作此订单');
    }

    // 已支付，直接返回
    if (payment.status === 1) {
      await t.rollback();
      return success(res, null, '订单已支付');
    }

    // 模拟支付成功
    payment.status = 1;
    payment.transactionId = 'MOCK_' + Date.now();
    payment.paidAt = new Date();
    await payment.save({ transaction: t });

    // 更新订单状态
    const order = payment.order;
    order.status = 1;
    order.paymentMethod = payment.paymentMethod;
    order.paidAt = new Date();
    await order.save({ transaction: t });

    await t.commit();

    return success(res, {
      orderId: order.id,
      orderNo: order.orderNo,
      paymentNo: payment.paymentNo,
      amount: payment.amount,
      paidAt: payment.paidAt
    }, '支付成功');

  } catch (err) {
    await t.rollback();
    console.error('模拟支付失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

// ==========================================
// 辅助函数
// ==========================================

/**
 * 生成微信支付参数（开发环境返回模拟数据）
 * @param {Object} order - 订单对象
 * @param {Object} payment - 支付记录对象
 * @returns {Object} 微信支付参数
 */
async function generateWechatPaymentParams(order, payment) {
  // ========== 真实环境的实现 ==========
  // const axios = require('axios');
  // const response = await axios.post('https://api.mch.weixin.qq.com/pay/unifiedorder', {
  //   appid: process.env.WECHAT_APPID,
  //   mch_id: process.env.WECHAT_MCH_ID,
  //   nonce_str: generateNonceStr(),
  //   body: '商品购买',
  //   out_trade_no: payment.paymentNo,
  //   total_fee: Math.round(order.totalAmount * 100), // 单位：分
  //   spbill_create_ip: '127.0.0.1',
  //   notify_url: process.env.WECHAT_NOTIFY_URL,
  //   trade_type: 'JSAPI',
  //   openid: req.userOpenid
  // });
  // return response.data;

  // ========== 开发环境（模拟数据）==========
  return {
    timeStamp: String(Math.floor(Date.now() / 1000)),
    nonceStr: generateNonceStr(),
    package: `prepay_id=mock_prepay_${Date.now()}`,
    signType: 'MD5',
    paySign: 'mock_sign_' + generateNonceStr(),
    paymentNo: payment.paymentNo
  };
}

/**
 * 生成随机字符串
 * @returns {string} 32位随机字符串
 */
function generateNonceStr() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * 构建微信支付回调响应（XML 格式）
 * @param {string} returnCode - 返回码（SUCCESS/FAIL）
 * @param {string} returnMsg - 返回消息
 * @returns {string} XML 字符串
 */
function buildWechatResponse(returnCode, returnMsg) {
  return `<xml>
  <return_code><![CDATA[${returnCode}]]></return_code>
  <return_msg><![CDATA[${returnMsg}]]></return_msg>
</xml>`;
}

/**
 * 验证微信支付签名
 * @param {Object} data - 微信回调数据
 * @returns {boolean} 签名是否有效
 */
function verifyWechatSign(data) {
  // ========== 真实环境的实现 ==========
  // 1. 获取微信返回的 sign
  // 2. 按规则拼接参数字符串
  // 3. 使用 API 密钥进行 MD5 签名
  // 4. 比对签名是否一致
  
  // 示例代码：
  // const { sign, ...params } = data;
  // const sortedKeys = Object.keys(params).sort();
  // const stringA = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
  // const stringSignTemp = stringA + '&key=' + process.env.WECHAT_API_KEY;
  // const calculatedSign = crypto.createHash('md5').update(stringSignTemp).digest('hex').toUpperCase();
  // return sign === calculatedSign;

  // 开发环境始终返回 true
  return true;
}

/**
 * 查询支付状态
 * 路由：GET /api/payments/:paymentNo
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 查询支付记录的状态
 * 
 * 请求参数：
 * @params {string} paymentNo - 支付流水号
 * 
 * 返回数据：
 * @returns {Object} { code: 200, data: payment }
 */
exports.getPaymentStatus = async (req, res) => {
  try {
    const { paymentNo } = req.params;
    const userId = req.userId;

    const payment = await Payment.findOne({
      where: { paymentNo },
      include: [{
        model: Order,
        as: 'order',
        where: { userId }
      }]
    });

    if (!payment) {
      return error(res, ErrorCodes.NOT_FOUND, '支付记录不存在');
    }

    return success(res, {
      paymentNo: payment.paymentNo,
      transactionId: payment.transactionId,
      paymentMethod: payment.paymentMethod,
      amount: payment.amount,
      status: payment.status,
      paidAt: payment.paidAt,
      order: {
        id: payment.order.id,
        orderNo: payment.order.orderNo,
        status: payment.order.status
      }
    });

  } catch (err) {
    console.error('查询支付状态失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

