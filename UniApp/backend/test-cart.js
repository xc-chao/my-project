// ==========================================
// 购物车模块快速测试脚本
// 使用方法：node test-cart.js
// 前提：服务器已启动，用户已登录
// ==========================================

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let testToken = '';

console.log('🧪 开始测试购物车模块...\n');
console.log('='.repeat(50));

async function runTests() {
  try {
    // ==========================================
    // 准备工作：登录获取 token
    // ==========================================
    console.log('\n📝 准备：登录获取 token');
    try {
      const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
        phone: '13800138001',
        password: '123456'
      });
      testToken = loginRes.data.data.token;
      console.log('✅ 登录成功');
      console.log('   用户:', loginRes.data.data.user.nickname);
    } catch (err) {
      console.error('❌ 登录失败，请先运行 npm run init-db');
      console.error('   错误:', err.response?.data?.message);
      return;
    }

    const headers = {
      'Authorization': `Bearer ${testToken}`,
      'Content-Type': 'application/json'
    };

    // ==========================================
    // 测试 1：清空购物车
    // ==========================================
    console.log('\n📝 测试 1: 清空购物车（准备干净环境）');
    try {
      const clearRes = await axios.delete(`${BASE_URL}/cart`, { headers });
      console.log('✅ 清空成功');
      console.log('   删除数量:', clearRes.data.data.deletedCount);
    } catch (err) {
      console.error('❌ 清空失败:', err.response?.data?.message);
    }

    // ==========================================
    // 测试 2：添加商品到购物车
    // ==========================================
    console.log('\n📝 测试 2: 添加商品到购物车');
    try {
      const addRes = await axios.post(`${BASE_URL}/cart`, {
        productId: 1,  // 可口可乐
        quantity: 2
      }, { headers });
      console.log('✅ 添加成功');
      console.log('   商品:', addRes.data.data.product.name);
      console.log('   数量:', addRes.data.data.quantity);
    } catch (err) {
      console.error('❌ 添加失败:', err.response?.data?.message);
    }

    // ==========================================
    // 测试 3：再次添加同一商品（应该增加数量）
    // ==========================================
    console.log('\n📝 测试 3: 再次添加同一商品');
    try {
      const addRes = await axios.post(`${BASE_URL}/cart`, {
        productId: 1,  // 可口可乐
        quantity: 1
      }, { headers });
      console.log('✅ 添加成功');
      console.log('   数量已更新为:', addRes.data.data.quantity);
    } catch (err) {
      console.error('❌ 添加失败:', err.response?.data?.message);
    }

    // ==========================================
    // 测试 4：添加不同的商品
    // ==========================================
    console.log('\n📝 测试 4: 添加不同的商品');
    try {
      await axios.post(`${BASE_URL}/cart`, {
        productId: 11,  // 乐事薯片
        quantity: 1
      }, { headers });
      console.log('✅ 添加商品2成功');

      await axios.post(`${BASE_URL}/cart`, {
        productId: 21,  // 康师傅方便面
        quantity: 2
      }, { headers });
      console.log('✅ 添加商品3成功');
    } catch (err) {
      console.error('❌ 添加失败:', err.response?.data?.message);
    }

    // ==========================================
    // 测试 5：获取购物车列表
    // ==========================================
    console.log('\n📝 测试 5: 获取购物车列表');
    try {
      const cartRes = await axios.get(`${BASE_URL}/cart`, { headers });
      console.log('✅ 获取成功');
      console.log('   商品数量:', cartRes.data.data.items.length);
      console.log('   选中商品数:', cartRes.data.data.total.selectedCount);
      console.log('   总金额: ¥', cartRes.data.data.total.totalAmount);
      console.log('   总数量:', cartRes.data.data.total.totalQuantity);
      
      console.log('\n   购物车详情:');
      cartRes.data.data.items.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.product.name} x${item.quantity} - ¥${item.product.price} ${item.selected ? '✓' : '✗'}`);
      });
    } catch (err) {
      console.error('❌ 获取失败:', err.response?.data?.message);
    }

    // ==========================================
    // 测试 6：获取购物车数量
    // ==========================================
    console.log('\n📝 测试 6: 获取购物车数量（角标）');
    try {
      const countRes = await axios.get(`${BASE_URL}/cart/count`, { headers });
      console.log('✅ 查询成功');
      console.log('   购物车商品种类数:', countRes.data.data.count);
    } catch (err) {
      console.error('❌ 查询失败:', err.response?.data?.message);
    }

    // ==========================================
    // 测试 7：更新商品数量
    // ==========================================
    console.log('\n📝 测试 7: 更新商品数量');
    try {
      // 获取第一个购物车项的 ID
      const cartRes = await axios.get(`${BASE_URL}/cart`, { headers });
      const firstItemId = cartRes.data.data.items[0].id;
      
      const updateRes = await axios.put(`${BASE_URL}/cart/${firstItemId}`, {
        quantity: 5
      }, { headers });
      console.log('✅ 更新成功');
      console.log('   新数量:', updateRes.data.data.quantity);
    } catch (err) {
      console.error('❌ 更新失败:', err.response?.data?.message);
    }

    // ==========================================
    // 测试 8：取消选中商品
    // ==========================================
    console.log('\n📝 测试 8: 取消选中商品');
    try {
      const cartRes = await axios.get(`${BASE_URL}/cart`, { headers });
      const secondItemId = cartRes.data.data.items[1]?.id;
      
      if (secondItemId) {
        const updateRes = await axios.put(`${BASE_URL}/cart/${secondItemId}`, {
          selected: false
        }, { headers });
        console.log('✅ 取消选中成功');
        console.log('   选中状态:', updateRes.data.data.selected);
      }
    } catch (err) {
      console.error('❌ 操作失败:', err.response?.data?.message);
    }

    // ==========================================
    // 测试 9：全选
    // ==========================================
    console.log('\n📝 测试 9: 全选购物车');
    try {
      const selectRes = await axios.put(`${BASE_URL}/cart/select-all`, {
        selected: true
      }, { headers });
      console.log('✅ 全选成功');
      console.log('   更新数量:', selectRes.data.data.updatedCount);
    } catch (err) {
      console.error('❌ 全选失败:', err.response?.data?.message);
    }

    // ==========================================
    // 测试 10：查看最终购物车状态
    // ==========================================
    console.log('\n📝 测试 10: 查看最终购物车状态');
    try {
      const cartRes = await axios.get(`${BASE_URL}/cart`, { headers });
      console.log('✅ 获取成功');
      console.log('   商品种类:', cartRes.data.data.items.length);
      console.log('   选中商品:', cartRes.data.data.total.selectedCount);
      console.log('   应付金额: ¥', cartRes.data.data.total.totalAmount);
    } catch (err) {
      console.error('❌ 获取失败:', err.response?.data?.message);
    }

    // ==========================================
    // 测试 11：删除单个商品
    // ==========================================
    console.log('\n📝 测试 11: 删除单个商品');
    try {
      const cartRes = await axios.get(`${BASE_URL}/cart`, { headers });
      const lastItemId = cartRes.data.data.items[cartRes.data.data.items.length - 1]?.id;
      
      if (lastItemId) {
        await axios.delete(`${BASE_URL}/cart/${lastItemId}`, { headers });
        console.log('✅ 删除成功');
      }
    } catch (err) {
      console.error('❌ 删除失败:', err.response?.data?.message);
    }

    // ==========================================
    // 测试 12：测试库存不足
    // ==========================================
    console.log('\n📝 测试 12: 测试库存不足情况');
    try {
      await axios.post(`${BASE_URL}/cart`, {
        productId: 1,
        quantity: 99999  // 超大数量
      }, { headers });
      console.log('❌ 应该返回库存不足错误');
    } catch (err) {
      if (err.response?.data?.code === 1201) {
        console.log('✅ 正确拦截（错误码 1201：商品库存不足）');
        console.log('   错误信息:', err.response.data.message);
      } else {
        console.error('❌ 返回了意外的错误:', err.response?.data);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 购物车模块测试完成！');
    console.log('='.repeat(50));

  } catch (err) {
    console.error('\n❌ 测试过程中出现异常:', err.message);
  }
}

// 运行测试
runTests();

