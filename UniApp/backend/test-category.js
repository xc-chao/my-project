// 测试分类筛选的脚本

const { Product } = require('./src/models');

async function test() {
  try {
    console.log('\n=== 测试数据库分类查询 ===\n');
    
    // 测试1：查询所有分类
    const categories = await Product.findAll({
      attributes: ['category'],
      group: ['category']
    });
    console.log('1. 数据库中的所有分类:');
    categories.forEach(c => {
      console.log(`   - "${c.category}" (字节: ${Buffer.from(c.category).toString('hex')})`);
    });
    
    // 测试2：查询饮料类商品
    console.log('\n2. 查询饮料类商品:');
    const drinks = await Product.findAll({
      where: { category: '饮料' }
    });
    console.log(`   找到 ${drinks.length} 个商品`);
    drinks.slice(0, 3).forEach(p => {
      console.log(`   - ${p.name} (分类: "${p.category}")`);
    });
    
    // 测试3：查询零食类商品
    console.log('\n3. 查询零食类商品:');
    const snacks = await Product.findAll({
      where: { category: '零食' }
    });
    console.log(`   找到 ${snacks.length} 个商品`);
    
    // 测试4：查询方便食品类
    console.log('\n4. 查询方便食品类:');
    const instant = await Product.findAll({
      where: { category: '方便食品' }
    });
    console.log(`   找到 ${instant.length} 个商品`);
    
    // 测试5：查询日用品类
    console.log('\n5. 查询日用品类:');
    const daily = await Product.findAll({
      where: { category: '日用品' }
    });
    console.log(`   找到 ${daily.length} 个商品`);
    
    console.log('\n=== 测试完成 ===\n');
    process.exit(0);
    
  } catch (error) {
    console.error('测试失败:', error);
    process.exit(1);
  }
}

test();

