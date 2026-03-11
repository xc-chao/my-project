<script setup lang="ts">
defineProps<{
  title: string;
  desc: string;
  actionText?: string;
}>();

const emit = defineEmits<{
  (event: 'action'): void;
}>();
</script>

<template>
  <view class="empty-card">
    <text class="empty-title">{{ title }}</text>
    <text class="empty-desc">{{ desc }}</text>
    <view v-if="actionText" class="action-btn" @tap="emit('action')">
      <text>{{ actionText }}</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.empty-card {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 36rpx 32rpx;
  border-radius: 40rpx;
  background: #ffffff;
}

.empty-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #111111;
}

.empty-desc {
  font-size: 24rpx;
  line-height: 1.6;
  color: #6e7380;
}

.action-btn {
  margin-top: 8rpx;
  align-self: flex-start;
  min-width: 180rpx;
  height: 84rpx;
  padding: 0 28rpx;
  border-radius: 42rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #17181c;
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 700;
}
</style>
