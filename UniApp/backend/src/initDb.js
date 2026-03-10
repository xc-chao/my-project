// ==========================================
// 数据库初始化脚本（使用 Sequelize）
// 功能：创建表结构并插入测试数据
// 使用方法：node src/initDb.js
// ==========================================

const { sequelize, User, Product, CartItem, Order, OrderItem, Payment } = require('./models');

async function initDatabase() {
  try {
    console.log('开始初始化数据库...\n');

    // ==========================================
    // 1. 连接数据库并同步表结构
    // ==========================================
    console.log('⏳ 正在同步数据库表结构...');
    await sequelize.sync({ force: true }); // force: true 会删除已存在的表并重新创建
    console.log('✅ 数据库表结构同步完成\n');

    // ==========================================
    // 2. 插入测试用户
    // ==========================================
    console.log('⏳ 正在插入测试用户...');
    const bcrypt = require('bcryptjs');
    
    // 生成测试密码（123456）
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);
    
    const users = await User.bulkCreate([
      {
        openid: 'mock_openid_user_001',
        nickname: '张三',
        avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKDXg3wvfwMZibPR8zclic8icn9FQ4ic0iaKKBxCgX8jqicicCf87qhBSxFWS3lJ1icOuQhBkRQqg0oBiayJzg/132',
        phone: '13800138001',
        password: hashedPassword, // 加密后的密码
        balance: 100.00
      },
      {
        openid: 'mock_openid_user_002',
        nickname: '李四',
        avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKDXg3wvfwMZibPR8zclic8icn9FQ4ic0iaKKBxCgX8jqicicCf87qhBSxFWS3lJ1icOuQhBkRQqg0oBiayJzg/132',
        phone: '13800138002',
        password: hashedPassword, // 加密后的密码
        balance: 50.00
      },
      {
        openid: 'mock_openid_user_003',
        nickname: '王五',
        avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKDXg3wvfwMZibPR8zclic8icn9FQ4ic0iaKKBxCgX8jqicicCf87qhBSxFWS3lJ1icOuQhBkRQqg0oBiayJzg/132',
        phone: null,
        password: null, // 微信用户未设置密码
        balance: 0.00
      }
    ]);
    console.log(`✅ 已插入 ${users.length} 个测试用户\n`);

    // ==========================================
    // 3. 插入测试商品（按分类）
    // ==========================================
    console.log('⏳ 正在插入测试商品...');
    const products = await Product.bulkCreate([
      // 饮料类
      {
        barcode: '6901234567890',
        name: '可口可乐 330ml',
        price: 3.00,
        stock: 100,
        imageUrl: 'https://img0.baidu.com/it/u=2291410115,2215911400&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
        category: '饮料',
        description: '经典美味，畅爽怡神'
      },
      {
        barcode: '6901234567891',
        name: '农夫山泉 550ml',
        price: 2.00,
        stock: 200,
        imageUrl: 'https://img1.baidu.com/it/u=3049104085,2832817355&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
        category: '饮料',
        description: '我们不生产水，我们只是大自然的搬运工'
      },
      {
        barcode: '6901234567898',
        name: '脉动青柠口味 600ml',
        price: 4.00,
        stock: 90,
        imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
        category: '饮料',
        description: '运动饮料，补充水分'
      },
      {
        barcode: '6901234567900',
        name: '伊利纯牛奶 250ml',
        price: 3.50,
        stock: 150,
        imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
        category: '饮料',
        description: '优质奶源，营养健康'
      },
      // 零食类
      {
        barcode: '6901234567892',
        name: '乐事原味薯片 70g',
        price: 7.50,
        stock: 50,
        imageUrl: 'https://img2.baidu.com/it/u=1805562095,3044143431&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
        category: '零食',
        description: '片片刻刻有乐事'
      },
      {
        barcode: '6901234567894',
        name: '旺旺雪饼 150g',
        price: 6.00,
        stock: 60,
        imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
        category: '零食',
        description: '香酥可口的经典零食'
      },
      {
        barcode: '6901234567896',
        name: '奥利奥夹心饼干',
        price: 8.50,
        stock: 40,
        imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
        category: '零食',
        description: '扭一扭，舔一舔，泡一泡'
      },
      {
        barcode: '6901234567897',
        name: '士力架巧克力',
        price: 5.00,
        stock: 70,
        imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
        category: '零食',
        description: '横扫饥饿，补充能量'
      },
      // 方便食品类
      {
        barcode: '6901234567893',
        name: '康师傅红烧牛肉面',
        price: 4.50,
        stock: 80,
        imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
        category: '方便食品',
        description: '经典红烧牛肉口味，香浓美味'
      },
      {
        barcode: '6901234567901',
        name: '统一老坛酸菜面',
        price: 4.50,
        stock: 75,
        imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
        category: '方便食品',
        description: '酸爽开胃，回味悠长'
      },
      {
        barcode: '6901234567902',
        name: '今麦郎红烧牛肉面',
        price: 4.00,
        stock: 60,
        imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
        category: '方便食品',
        description: '料足味美'
      },
      // 日用品类
      {
        barcode: '6901234567899',
        name: '益达口香糖 木糖醇',
        price: 6.50,
        stock: 100,
        imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
        category: '日用品',
        description: '清新口气，保护牙齿'
      },
      {
        barcode: '6901234567903',
        name: '清风纸巾 3包装',
        price: 9.90,
        stock: 50,
        imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
        category: '日用品',
        description: '柔软亲肤'
      },
      {
        barcode: '6901234567904',
        name: '舒肤佳香皂',
        price: 5.50,
        stock: 45,
        imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
        category: '日用品',
        description: '健康除菌'
      }
    ]);
    console.log(`✅ 已插入 ${products.length} 个测试商品\n`);

    // ==========================================
    // 4. 插入购物车数据
    // ==========================================
    console.log('⏳ 正在插入购物车数据...');
    const cartItems = await CartItem.bulkCreate([
      { userId: 1, productId: 1, quantity: 2 }, // 张三：2瓶可口可乐
      { userId: 1, productId: 5, quantity: 1 }, // 张三：1包乐事薯片
      { userId: 2, productId: 2, quantity: 3 }, // 李四：3瓶农夫山泉
      { userId: 2, productId: 9, quantity: 2 }  // 李四：2包康师傅方便面
    ]);
    console.log(`✅ 已插入 ${cartItems.length} 条购物车数据\n`);

    // ==========================================
    // 5. 插入订单数据
    // ==========================================
    console.log('⏳ 正在插入订单数据...');
    const orders = await Order.bulkCreate([
      {
        orderNo: 'SN202512300001',
        userId: 1,
        totalAmount: 15.50,
        status: 1,
        paymentMethod: 'wechat',
        paidAt: new Date('2025-12-30 10:30:00')
      },
      {
        orderNo: 'SN202512300002',
        userId: 2,
        totalAmount: 10.00,
        status: 1,
        paymentMethod: 'balance',
        paidAt: new Date('2025-12-30 11:00:00')
      },
      {
        orderNo: 'SN202512300003',
        userId: 1,
        totalAmount: 8.00,
        status: 0,
        paymentMethod: null,
        paidAt: null
      }
    ]);
    console.log(`✅ 已插入 ${orders.length} 个订单\n`);

    // ==========================================
    // 6. 插入订单明细数据
    // ==========================================
    console.log('⏳ 正在插入订单明细...');
    const orderItems = await OrderItem.bulkCreate([
      // 订单1的商品
      { orderId: 1, productId: 1, quantity: 2, price: 3.00, subtotal: 6.00 },
      { orderId: 1, productId: 5, quantity: 1, price: 7.50, subtotal: 7.50 },
      { orderId: 1, productId: 2, quantity: 1, price: 2.00, subtotal: 2.00 },
      // 订单2的商品
      { orderId: 2, productId: 2, quantity: 5, price: 2.00, subtotal: 10.00 },
      // 订单3的商品
      { orderId: 3, productId: 9, quantity: 1, price: 4.50, subtotal: 4.50 },
      { orderId: 3, productId: 4, quantity: 1, price: 3.50, subtotal: 3.50 }
    ]);
    console.log(`✅ 已插入 ${orderItems.length} 条订单明细\n`);

    // ==========================================
    // 7. 插入支付记录（模拟已支付的订单）
    // ==========================================
    console.log('⏳ 正在插入支付记录...');
    const payments = await Payment.bulkCreate([
      {
        orderId: 1,
        paymentNo: 'PAY' + Date.now() + '001',
        transactionId: 'WX_' + Date.now() + '001',
        paymentMethod: 'wechat',
        amount: 15.50,
        status: 1,
        paidAt: new Date('2025-12-30 10:30:00')
      },
      {
        orderId: 2,
        paymentNo: 'PAY' + Date.now() + '002',
        transactionId: null,
        paymentMethod: 'balance',
        amount: 10.00,
        status: 1,
        paidAt: new Date('2025-12-30 11:00:00')
      }
    ]);
    console.log(`✅ 已插入 ${payments.length} 条支付记录\n`);

    // ==========================================
    // 8. 显示统计信息
    // ==========================================
    console.log('='.repeat(50));
    console.log('📊 数据库初始化统计');
    console.log('='.repeat(50));
    console.log(`用户数量：${users.length} 个`);
    console.log(`商品数量：${products.length} 个`);
    console.log(`购物车项：${cartItems.length} 条`);
    console.log(`订单数量：${orders.length} 个`);
    console.log(`订单明细：${orderItems.length} 条`);
    console.log(`支付记录：${payments.length} 条`);
    console.log('='.repeat(50));
    
    console.log('\n✅ 数据库初始化完成！');
    console.log('\n📝 测试账号信息：');
    console.log('   用户1: 张三 (手机号: 13800138001, 密码: 123456, 余额: ¥100.00)');
    console.log('   用户2: 李四 (手机号: 13800138002, 密码: 123456, 余额: ¥50.00)');
    console.log('   用户3: 王五 (微信用户, 未设置手机号和密码, 余额: ¥0.00)');
    
    console.log('\n📦 测试商品分类：');
    console.log('   饮料: 4个商品');
    console.log('   零食: 4个商品');
    console.log('   方便食品: 3个商品');
    console.log('   日用品: 3个商品');
    
    console.log('\n🔖 测试条形码：');
    console.log('   6901234567890 - 可口可乐 330ml');
    console.log('   6901234567891 - 农夫山泉 550ml');
    console.log('   6901234567892 - 乐事原味薯片 70g');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 数据库初始化失败:', error);
    process.exit(1);
  }
}

// 执行初始化
initDatabase();

