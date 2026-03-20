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
  width: calc(50% - 12rpx);
  border-radius: 24rpx;
  background: #ffffff;
  overflow: hidden;
}

.card-cover {
  width: 100%;
  height: 220rpx;
  background: #eef0f4;
}

.card-body {
  padding: 18rpx 16rpx 20rpx;
}

.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-bottom: 10rpx;
}

.badge {
  padding: 6rpx 12rpx;
  border-radius: 999rpx;
  background: #f5f6f8;
  color: #6e7380;
  font-size: 18rpx;
  font-weight: 600;
}

.title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  min-height: 72rpx;
  font-size: 24rpx;
  font-weight: 700;
  line-height: 1.5;
  color: #111111;
}

.subtitle {
  display: block;
  margin-top: 6rpx;
  font-size: 18rpx;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #6e7380;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
  margin-top: 14rpx;
  flex-wrap: wrap;
}

.price {
  font-size: 28rpx;
  font-weight: 700;
  color: #f25a52;
}

.origin {
  font-size: 18rpx;
  color: #9aa0aa;
  text-decoration: line-through;
}
</style>
