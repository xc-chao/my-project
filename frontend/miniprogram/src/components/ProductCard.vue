<script setup lang="ts">
import type { ProductItem } from '../mock/data';

defineProps<{
  item: ProductItem;
}>();

const emit = defineEmits<{
  (event: 'select'): void;
}>();
</script>

<template>
  <view class="card" @tap="emit('select')">
    <image class="card-cover" :src="item.cover" mode="aspectFill" />
    <view class="card-body">
      <view class="badge-row">
        <text v-for="badge in item.badges" :key="badge" class="badge">{{ badge }}</text>
      </view>
      <text class="title">{{ item.title }}</text>
      <text class="subtitle">{{ item.subtitle }}</text>
      <view class="price-row">
        <text class="price">¥{{ item.price }}</text>
        <text class="origin">¥{{ item.originalPrice }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.card {
  width: 100%;
  border-radius: 28rpx;
  background: #ffffff;
  overflow: hidden;
}

.card-cover {
  width: 100%;
  height: 320rpx;
  background: #eef0f4;
}

.card-body {
  padding: 20rpx;
}

.badge-row {
  display: flex;
  gap: 10rpx;
  margin-bottom: 12rpx;
}

.badge {
  padding: 6rpx 12rpx;
  border-radius: 999rpx;
  background: #f2f4f8;
  color: #6e7380;
  font-size: 22rpx;
  font-weight: 600;
}

.title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #111111;
}

.subtitle {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #6e7380;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
  margin-top: 16rpx;
}

.price {
  font-size: 36rpx;
  font-weight: 700;
  color: #111111;
}

.origin {
  font-size: 24rpx;
  color: #9aa0aa;
  text-decoration: line-through;
}
</style>
