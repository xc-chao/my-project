<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';

const props = defineProps<{
  current: 'home' | 'cart' | 'profile';
}>();

const tabs = [
  { key: 'home', label: '首页', url: '/pages/home/index' },
  { key: 'cart', label: '购物车', url: '/pages/cart/index' },
  { key: 'profile', label: '我的', url: '/pages/profile/index' }
] as const;

function switchPage(url: string) {
  uni.switchTab({ url });
}

onShow(() => {
  uni.hideTabBar();
});
</script>

<template>
  <view class="tabbar safe-bottom">
    <view class="pill">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        :class="['pill-item', { active: props.current === tab.key }]"
        @tap="switchPage(tab.url)"
      >
        <text class="pill-label">{{ tab.label }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.tabbar {
  position: fixed;
  left: 42rpx;
  right: 42rpx;
  bottom: 20rpx;
  z-index: 20;
}

.pill {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx;
  height: 124rpx;
  border-radius: 72rpx;
  background: #ffffff;
  border: 1px solid #e7e9ee;
}

.pill-item {
  flex: 1;
  height: 100%;
  border-radius: 52rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pill-item.active {
  background: #17181c;
}

.pill-label {
  font-size: 22rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
  color: #8c93a1;
}

.pill-item.active .pill-label {
  color: #ffffff;
}
</style>
