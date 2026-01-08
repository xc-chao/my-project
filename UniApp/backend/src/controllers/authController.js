// ==========================================
// 认证控制器（AuthController）
// 功能：处理用户登录、注册、获取信息等认证相关业务
// ==========================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { success, error } = require('../utils/response');
const ErrorCodes = require('../constants/errorCodes');
const { isValidPhone, isValidPassword, validateRequired } = require('../utils/validator');

/**
 * 微信小程序登录
 * 路由：POST /api/auth/wechat-login
 * 
 * 功能说明：
 * 1. 接收微信小程序的 code（wx.login 获取）
 * 2. 用 code 换取 openid（需要调用微信 API）
 * 3. 如果用户不存在则自动注册
 * 4. 生成 JWT token 返回
 * 
 * 请求参数：
 * @body {string} code - 微信登录临时凭证
 * @body {string} nickname - 用户昵称（可选）
 * @body {string} avatar - 用户头像（可选）
 * 
 * 返回数据：
 * @returns {Object} { code: 200, data: { token, user } }
 */
exports.wechatLogin = async (req, res) => {
  try {
    const { code, nickname, avatar } = req.body;
    
    // 验证必填参数
    if (!code) {
      return error(res, ErrorCodes.BAD_REQUEST, '微信登录code不能为空');
    }

    // ========== 真实环境下的做法 ==========
    // 调用微信 API 换取 openid
    // const { data } = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
    //   params: {
    //     appid: process.env.WECHAT_APPID,
    //     secret: process.env.WECHAT_SECRET,
    //     js_code: code,
    //     grant_type: 'authorization_code'
    //   }
    // });
    // const openid = data.openid;
    
    // ========== 演示环境（模拟 openid）==========
    const openid = `mock_openid_${code}`;

    // 查找或创建用户
    let user = await User.findOne({ where: { openid } });

    if (!user) {
      // 用户不存在，自动注册
      user = await User.create({
        openid,
        nickname: nickname || '微信用户',
        avatar: avatar || null,
        balance: 0.00
      });
    } else {
      // 用户已存在，更新昵称和头像
      if (nickname) user.nickname = nickname;
      if (avatar) user.avatar = avatar;
      await user.save();
    }

    // 生成 JWT token（有效期 7 天）
    const token = jwt.sign(
      { 
        userId: user.id, 
        openid: user.openid,
        type: 'wechat' // 登录类型
      },
      process.env.JWT_SECRET || 'scanshop_secret_key_2025',
      { expiresIn: '7d' }
    );

    // 返回成功响应（不返回密码）
    return success(res, {
      token,
      user: {
        id: user.id,
        openid: user.openid,
        nickname: user.nickname,
        avatar: user.avatar,
        phone: user.phone,
        balance: user.balance
      }
    }, '登录成功');

  } catch (err) {
    console.error('微信登录失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 手机号密码注册
 * 路由：POST /api/auth/register
 * 
 * 功能说明：
 * 1. 验证手机号格式
 * 2. 验证密码强度
 * 3. 检查手机号是否已注册
 * 4. 使用 bcrypt 加密密码
 * 5. 创建新用户
 * 6. 生成 JWT token
 * 
 * 请求参数：
 * @body {string} phone - 手机号
 * @body {string} password - 密码
 * @body {string} nickname - 昵称（可选）
 * 
 * 返回数据：
 * @returns {Object} { code: 200, data: { token, user } }
 */
exports.register = async (req, res) => {
  try {
    const { phone, password, nickname } = req.body;

    // 验证必填参数
    const validation = validateRequired(req.body, ['phone', 'password']);
    if (!validation.valid) {
      return error(res, ErrorCodes.BAD_REQUEST, `缺少必填字段: ${validation.missingFields.join(', ')}`);
    }

    // 验证手机号格式
    if (!isValidPhone(phone)) {
      return error(res, ErrorCodes.USER_PHONE_INVALID);
    }

    // 验证密码强度
    if (!isValidPassword(password)) {
      return error(res, ErrorCodes.USER_PASSWORD_WEAK);
    }

    // 检查手机号是否已注册
    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return error(res, ErrorCodes.AUTH_PHONE_EXISTED);
    }

    // 加密密码（bcrypt）
    const salt = await bcrypt.genSalt(10); // 生成盐值
    const hashedPassword = await bcrypt.hash(password, salt); // 加密密码

    // 创建新用户
    const user = await User.create({
      phone,
      password: hashedPassword,
      nickname: nickname || `用户${phone.slice(-4)}`, // 默认昵称：用户+手机号后4位
      balance: 0.00
    });

    // 生成 JWT token（有效期 7 天）
    const token = jwt.sign(
      { 
        userId: user.id,
        phone: user.phone,
        type: 'phone' // 登录类型
      },
      process.env.JWT_SECRET || 'scanshop_secret_key_2025',
      { expiresIn: '7d' }
    );

    // 返回成功响应（不返回密码）
    return success(res, {
      token,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar,
        balance: user.balance
      }
    }, '注册成功');

  } catch (err) {
    console.error('注册失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 手机号密码登录
 * 路由：POST /api/auth/login
 * 
 * 功能说明：
 * 1. 验证手机号和密码
 * 2. 查询用户
 * 3. 比对密码（bcrypt.compare）
 * 4. 生成 JWT token
 * 
 * 请求参数：
 * @body {string} phone - 手机号
 * @body {string} password - 密码
 * 
 * 返回数据：
 * @returns {Object} { code: 200, data: { token, user } }
 */
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // 验证必填参数
    const validation = validateRequired(req.body, ['phone', 'password']);
    if (!validation.valid) {
      return error(res, ErrorCodes.BAD_REQUEST, `缺少必填字段: ${validation.missingFields.join(', ')}`);
    }

    // 查询用户
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return error(res, ErrorCodes.AUTH_USER_NOT_FOUND, '手机号未注册');
    }

    // 验证密码为空（说明是微信登录的用户）
    if (!user.password) {
      return error(res, ErrorCodes.AUTH_PASSWORD_INCORRECT, '该账号未设置密码，请使用微信登录');
    }

    // 比对密码（bcrypt）
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return error(res, ErrorCodes.AUTH_PASSWORD_INCORRECT);
    }

    // 生成 JWT token（有效期 7 天）
    const token = jwt.sign(
      { 
        userId: user.id,
        phone: user.phone,
        type: 'phone'
      },
      process.env.JWT_SECRET || 'scanshop_secret_key_2025',
      { expiresIn: '7d' }
    );

    // 返回成功响应
    return success(res, {
      token,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar,
        balance: user.balance,
        openid: user.openid
      }
    }, '登录成功');

  } catch (err) {
    console.error('登录失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 获取当前用户信息
 * 路由：GET /api/auth/profile
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 从 JWT token 中解析出 userId，查询用户详细信息
 * 
 * 返回数据：
 * @returns {Object} { code: 200, data: user }
 */
exports.getProfile = async (req, res) => {
  try {
    // req.userId 由 authMiddleware 注入
    const user = await User.findByPk(req.userId);

    if (!user) {
      return error(res, ErrorCodes.AUTH_USER_NOT_FOUND);
    }

    // 返回用户信息（不包含密码）
    return success(res, {
      id: user.id,
      openid: user.openid,
      phone: user.phone,
      nickname: user.nickname,
      avatar: user.avatar,
      balance: user.balance,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    });

  } catch (err) {
    console.error('获取用户信息失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 更新用户信息
 * 路由：PUT /api/auth/profile
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 允许用户更新昵称、头像
 * 
 * 请求参数：
 * @body {string} nickname - 昵称（可选）
 * @body {string} avatar - 头像（可选）
 * 
 * 返回数据：
 * @returns {Object} { code: 200, data: user }
 */
exports.updateProfile = async (req, res) => {
  try {
    const { nickname, avatar } = req.body;
    const user = await User.findByPk(req.userId);

    if (!user) {
      return error(res, ErrorCodes.AUTH_USER_NOT_FOUND);
    }

    // 更新信息
    if (nickname) user.nickname = nickname;
    if (avatar) user.avatar = avatar;
    await user.save();

    return success(res, {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      phone: user.phone,
      balance: user.balance
    }, '更新成功');

  } catch (err) {
    console.error('更新用户信息失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 修改密码
 * 路由：PUT /api/auth/password
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 验证旧密码，设置新密码
 * 
 * 请求参数：
 * @body {string} oldPassword - 旧密码
 * @body {string} newPassword - 新密码
 * 
 * 返回数据：
 * @returns {Object} { code: 200, message: '密码修改成功' }
 */
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // 验证必填参数
    const validation = validateRequired(req.body, ['oldPassword', 'newPassword']);
    if (!validation.valid) {
      return error(res, ErrorCodes.BAD_REQUEST, `缺少必填字段: ${validation.missingFields.join(', ')}`);
    }

    // 验证新密码强度
    if (!isValidPassword(newPassword)) {
      return error(res, ErrorCodes.USER_PASSWORD_WEAK);
    }

    // 查询用户
    const user = await User.findByPk(req.userId);
    if (!user) {
      return error(res, ErrorCodes.AUTH_USER_NOT_FOUND);
    }

    // 如果用户没有设置密码（微信登录用户）
    if (!user.password) {
      return error(res, ErrorCodes.BAD_REQUEST, '账号未设置密码，无法修改');
    }

    // 验证旧密码
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return error(res, ErrorCodes.AUTH_PASSWORD_INCORRECT, '旧密码错误');
    }

    // 加密新密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 更新密码
    user.password = hashedPassword;
    await user.save();

    return success(res, null, '密码修改成功');

  } catch (err) {
    console.error('修改密码失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 绑定手机号
 * 路由：POST /api/auth/bind-phone
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 微信登录的用户可以绑定手机号，并设置密码
 * 
 * 请求参数：
 * @body {string} phone - 手机号
 * @body {string} password - 密码
 * 
 * 返回数据：
 * @returns {Object} { code: 200, message: '绑定成功' }
 */
exports.bindPhone = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // 验证必填参数
    const validation = validateRequired(req.body, ['phone', 'password']);
    if (!validation.valid) {
      return error(res, ErrorCodes.BAD_REQUEST, `缺少必填字段: ${validation.missingFields.join(', ')}`);
    }

    // 验证手机号格式
    if (!isValidPhone(phone)) {
      return error(res, ErrorCodes.USER_PHONE_INVALID);
    }

    // 验证密码强度
    if (!isValidPassword(password)) {
      return error(res, ErrorCodes.USER_PASSWORD_WEAK);
    }

    // 查询当前用户
    const user = await User.findByPk(req.userId);
    if (!user) {
      return error(res, ErrorCodes.AUTH_USER_NOT_FOUND);
    }

    // 检查手机号是否已被使用
    if (user.phone) {
      return error(res, ErrorCodes.BAD_REQUEST, '已绑定手机号，无法重复绑定');
    }

    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      return error(res, ErrorCodes.AUTH_PHONE_EXISTED);
    }

    // 加密密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 绑定手机号和密码
    user.phone = phone;
    user.password = hashedPassword;
    await user.save();

    return success(res, {
      phone: user.phone,
      nickname: user.nickname
    }, '绑定成功');

  } catch (err) {
    console.error('绑定手机号失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 获取账户余额
 * 路由：GET /api/auth/balance
 * 权限：需要 JWT 认证
 * 
 * 返回数据：
 * @returns {Object} { code: 200, data: { balance } }
 */
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return error(res, ErrorCodes.AUTH_USER_NOT_FOUND);
    }

    return success(res, {
      balance: user.balance,
      userId: user.id
    });

  } catch (err) {
    console.error('获取余额失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

