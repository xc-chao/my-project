#!/bin/bash

# ==========================================
# 快速测试脚本（使用 curl）
# 使用方法：bash quick-test.sh
# ==========================================

echo "🧪 开始快速测试 ScanShop API..."
echo ""
echo "=================================================="
echo ""

# 测试 1：健康检查
echo "📝 测试 1: 健康检查"
curl -s http://localhost:3000/health | grep -q "running" && echo "✅ 服务器运行正常" || echo "❌ 服务器未启动"
echo ""

# 测试 2：登录
echo "📝 测试 2: 用户登录"
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138001","password":"123456"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo "✅ 登录成功"
  echo "   Token: ${TOKEN:0:50}..."
else
  echo "❌ 登录失败"
  exit 1
fi
echo ""

# 测试 3：获取购物车
echo "📝 测试 3: 获取购物车"
curl -s -X GET http://localhost:3000/api/cart \
  -H "Authorization: Bearer $TOKEN" | grep -q "code" && echo "✅ 购物车接口正常" || echo "❌ 购物车接口失败"
echo ""

# 测试 4：添加商品到购物车
echo "📝 测试 4: 添加商品到购物车"
curl -s -X POST http://localhost:3000/api/cart \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":2}' | grep -q "已加入购物车" && echo "✅ 添加成功" || echo "❌ 添加失败"
echo ""

# 测试 5：创建订单
echo "📝 测试 5: 创建订单"
ORDER_ID=$(curl -s -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}' | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -n "$ORDER_ID" ]; then
  echo "✅ 订单创建成功"
  echo "   订单ID: $ORDER_ID"
else
  echo "⚠️  订单创建失败（可能购物车已空）"
fi
echo ""

# 测试 6：获取订单列表
echo "📝 测试 6: 获取订单列表"
curl -s -X GET "http://localhost:3000/api/orders?page=1&pageSize=10" \
  -H "Authorization: Bearer $TOKEN" | grep -q "orders" && echo "✅ 订单列表接口正常" || echo "❌ 订单列表接口失败"
echo ""

echo "=================================================="
echo "🎉 快速测试完成！"
echo "=================================================="
echo ""
echo "💡 提示："
echo "   • 服务器运行在 http://localhost:3000"
echo "   • 测试账号: 13800138001 / 123456"
echo "   • 查看完整测试: node test-order.js"
echo ""

