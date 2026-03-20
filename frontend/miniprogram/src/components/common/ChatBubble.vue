<script setup lang="ts">
defineProps<{
  role: 'user' | 'assistant';
  content: string;
}>();
</script>

<template>
  <view :class="['msg-bubble', role]">
    <text>{{ content }}</text>
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
</style>
