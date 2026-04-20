<script setup lang="ts">
defineProps<{
  title: string;
  desc?: string;
}>();
</script>

<template>
  <view class="section">
    <view class="head">
      <text class="title">{{ title }}</text>
      <text v-if="desc" class="desc">{{ desc }}</text>
    </view>
    <slot />
  </view>
</template>

<style scoped lang="scss">
.section {
  display: flex;
  flex-direction: column;
  padding: 28rpx;
  margin-bottom: 20rpx;
  margin-top: 20px;
  border-radius: 40rpx;
  background: #ffffff;
}

.head {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.title {
  font-size: 30rpx;
  font-weight: 700;
  color: #111111;
}

.desc {
  font-size: 24rpx;
  line-height: 1.6;
  color: #6e7380;
}
</style>
