// ==========================================
// 认证模块快速测试脚本
// 使用方法：node test-auth.js
// ==========================================

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let testToken = '';

// 延迟函数
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

console.log('🧪 开始测试认证模块...\n');
console.log('确保服务器已启动: npm run dev\n');
console.log('='.repeat(50));

async function runTests() {
  try {
    // ==========================================
    // 测试 1：手机号注册
    // ==========================================
    console.log('\n📝 测试 1: 手机号注册');
    try {
      const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
        phone: '13900139000',
        password: '123456',
        nickname: '测试用户'
      });
      console.log('✅ 注册成功');
      console.log('   Token:', registerRes.data.data.token.substring(0, 30) + '...');
      console.log('   用户:', registerRes.data.data.user.nickname);
      testToken = registerRes.data.data.token;
    } catch (err) {
      if (err.response?.data?.code === 1007) {
        console.log('⚠️  手机号已注册（预期行为）');
      } else {
        console.error('❌ 注册失败:', err.response?.data || err.message);
      }
    }

    await sleep(500);

    // ==========================================
    // 测试 2：手机号登录
    // ==========================================
    console.log('\n📝 测试 2: 手机号登录');
    try {
      const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
        phone: '13800138001',
        password: '123456'
      });
      console.log('✅ 登录成功');
      console.log('   Token:', loginRes.data.data.token.substring(0, 30) + '...');
      console.log('   用户:', loginRes.data.data.user.nickname);
      console.log('   余额: ¥', loginRes.data.data.user.balance);
      testToken = loginRes.data.data.token;
    } catch (err) {
      console.error('❌ 登录失败:', err.response?.data || err.message);
    }

    await sleep(500);

    // ==========================================
    // 测试 3：微信登录
    // ==========================================
    console.log('\n📝 测试 3: 微信登录');
    try {
      const wechatRes = await axios.post(`${BASE_URL}/auth/wechat-login`, {
        code: 'test_code_' + Date.now(),
        nickname: '微信测试用户',
        avatar: 'https://test-avatar.jpg'
      });
      console.log('✅ 微信登录成功');
      console.log('   用户:', wechatRes.data.data.user.nickname);
      console.log('   OpenID:', wechatRes.data.data.user.openid);
    } catch (err) {
      console.error('❌ 微信登录失败:', err.response?.data || err.message);
    }

    await sleep(500);

    // ==========================================
    // 测试 4：获取用户信息（需要 token）
    // ==========================================
    console.log('\n📝 测试 4: 获取用户信息（需认证）');
    try {
      const profileRes = await axios.get(`${BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${testToken}`
        }
      });
      console.log('✅ 获取成功');
      console.log('   用户ID:', profileRes.data.data.id);
      console.log('   昵称:', profileRes.data.data.nickname);
      console.log('   手机号:', profileRes.data.data.phone);
      console.log('   余额: ¥', profileRes.data.data.balance);
    } catch (err) {
      console.error('❌ 获取失败:', err.response?.data || err.message);
    }

    await sleep(500);

    // ==========================================
    // 测试 5：更新用户信息
    // ==========================================
    console.log('\n📝 测试 5: 更新用户信息');
    try {
      const updateRes = await axios.put(`${BASE_URL}/auth/profile`, {
        nickname: '测试用户（已更新）'
      }, {
        headers: {
          'Authorization': `Bearer ${testToken}`
        }
      });
      console.log('✅ 更新成功');
      console.log('   新昵称:', updateRes.data.data.nickname);
    } catch (err) {
      console.error('❌ 更新失败:', err.response?.data || err.message);
    }

    await sleep(500);

    // ==========================================
    // 测试 6：查询余额
    // ==========================================
    console.log('\n📝 测试 6: 查询账户余额');
    try {
      const balanceRes = await axios.get(`${BASE_URL}/auth/balance`, {
        headers: {
          'Authorization': `Bearer ${testToken}`
        }
      });
      console.log('✅ 查询成功');
      console.log('   余额: ¥', balanceRes.data.data.balance);
    } catch (err) {
      console.error('❌ 查询失败:', err.response?.data || err.message);
    }

    await sleep(500);

    // ==========================================
    // 测试 7：错误情况 - 无 token 访问
    // ==========================================
    console.log('\n📝 测试 7: 无 token 访问受保护接口');
    try {
      await axios.get(`${BASE_URL}/auth/profile`);
      console.log('❌ 应该返回错误，但成功了');
    } catch (err) {
      if (err.response?.data?.code === 1001) {
        console.log('✅ 正确拦截（错误码 1001：未提供认证令牌）');
      } else {
        console.error('❌ 返回了意外的错误:', err.response?.data);
      }
    }

    await sleep(500);

    // ==========================================
    // 测试 8：错误情况 - 密码错误
    // ==========================================
    console.log('\n📝 测试 8: 密码错误登录');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        phone: '13800138001',
        password: 'wrong_password'
      });
      console.log('❌ 应该返回错误，但成功了');
    } catch (err) {
      if (err.response?.data?.code === 1008) {
        console.log('✅ 正确拦截（错误码 1008：密码错误）');
      } else {
        console.error('❌ 返回了意外的错误:', err.response?.data);
      }
    }

    await sleep(500);

    // ==========================================
    // 测试 9：错误情况 - 手机号格式错误
    // ==========================================
    console.log('\n📝 测试 9: 手机号格式错误');
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        phone: '12345',
        password: '123456'
      });
      console.log('❌ 应该返回错误，但成功了');
    } catch (err) {
      if (err.response?.data?.code === 1102) {
        console.log('✅ 正确拦截（错误码 1102：手机号格式不正确）');
      } else {
        console.error('❌ 返回了意外的错误:', err.response?.data);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 测试完成！');
    console.log('='.repeat(50));

  } catch (err) {
    console.error('\n❌ 测试过程中出现异常:', err.message);
    console.log('\n请确保：');
    console.log('1. 服务器已启动（npm run dev）');
    console.log('2. 数据库已初始化（npm run init-db）');
  }
}

// 运行测试
runTests();

