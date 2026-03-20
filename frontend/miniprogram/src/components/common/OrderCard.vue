<script setup lang="ts">
const props = defineProps<{
  item: {
    id: string;
    status: string;
    amount: number;
    createdAt: string;
    items: Array<{
      id: string;
      quantity: number;
      size: string;
      product?: {
        title: string;
        cover: string;
      };
    }>;
  };
  actionText?: string;
}>();

const emit = defineEmits<{
  (event: 'action', id: string): void;
}>();

function formatStatus(status: string) {
  return (
    {
      pending_payment: '待支付',
      pending_shipping: '待发货',
      shipped: '已发货',
      completed: '已完成',
      cancelled: '已取消'
    }[status] || status
  );
}
</script>

<template>
  <view class="card">
    <view class="top-row">
      <text class="order-id">订单 {{ item.id }}</text>
      <text class="status">{{ formatStatus(item.status) }}</text>
    </view>
    <view v-for="goods in item.items" :key="goods.id" class="goods-row">
      <image class="cover" :src="goods.product?.cover" mode="aspectFill" />
      <view class="goods-info">
        <text class="title">{{ goods.product?.title }}</text>
        <text class="meta">规格 {{ goods.size }} · x{{ goods.quantity }}</text>
      </view>
    </view>
    <view class="bottom-row">
      <text class="time">{{ item.createdAt }}</text>
      <view class="price-wrap">
        <text class="price">¥{{ item.amount }}</text>
        <view v-if="actionText" class="action-btn" @tap="emit('action', props.item.id)">
          <text>{{ actionText }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  padding: 28rpx;
  border-radius: 40rpx;
  background: #ffffff;
}

.top-row,
.bottom-row,
.goods-row,
.price-wrap {
  display: flex;
  align-items: center;
}

.top-row,
.bottom-row {
  justify-content: space-between;
}

.order-id,
.title,
.price {
  color: #111111;
}

.order-id,
.title {
  font-size: 28rpx;
  font-weight: 700;
}

.status,
.meta,
.time {
  font-size: 24rpx;
  color: #6e7380;
}

.status {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: #f3f4f8;
  font-weight: 700;
}

.goods-row {
  gap: 18rpx;
  padding: 18rpx;
  border-radius: 28rpx;
  background: #f7f7fa;
}

.cover {
  width: 132rpx;
  height: 132rpx;
  border-radius: 24rpx;
  background: #eef0f4;
}

.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.price-wrap {
  gap: 16rpx;
}

.price {
  font-size: 34rpx;
}

.action-btn {
  min-width: 148rpx;
  height: 72rpx;
  padding: 0 24rpx;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #17181c;
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 700;
}
</style>
