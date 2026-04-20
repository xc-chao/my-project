<script setup lang="ts">
defineProps<{
  role: 'user' | 'assistant';
  content: string;
  loading?: boolean;
}>();
</script>

<template>
  <view :class="['msg-bubble', role]">
    <view v-if="loading" class="loading-dots">
      <view class="dot" /><view class="dot" /><view class="dot" />
    </view>
    <text v-else>{{ content }}</text>
  </view>
</template>

<style scoped lang="scss">
.msg-bubble {
  max-width: 82%;
  padding: 24rpx;
  border-radius: 36rpx;
  background: #ffffff;
  box-shadow: 0 12rpx 24rpx rgba(17, 17, 17, 0.04);
  font-size: 26rpx;
  line-height: 1.7;
  color: #111111;
}

.msg-bubble.user {
  align-self: flex-end;
  background: #17181c;
  color: #ffffff;
  box-shadow: none;
}

.msg-bubble.assistant {
  align-self: flex-start;
  border: 1px solid #eef0f4;
}

.loading-dots {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 4rpx 0;
}

.dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #999;
  animation: dotBounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.16s;
}

.dot:nth-child(3) {
  animation-delay: 0.32s;
}

@keyframes dotBounce {
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
