<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import UniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';

const props = defineProps<{
  current: 'home' | 'search' | 'cart' | 'profile';
}>();

const tabs = [
  { key: 'home', label: '首页', icon: 'home', activeIcon: 'home-filled', url: '/pages/home/index' },
  { key: 'search', label: '搜索', icon: 'search', activeIcon: 'search', url: '/pages/search/index' },
  { key: 'cart', label: '购物车', icon: 'cart', activeIcon: 'cart-filled', url: '/pages/cart/index' },
  { key: 'profile', label: '我的', icon: 'person', activeIcon: 'person-filled', url: '/pages/profile/index' }
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
        <view class="pill-content">
          <UniIcons
            :type="props.current === tab.key ? tab.activeIcon : tab.icon"
            :size="20"
            :color="props.current === tab.key ? '#ffffff' : '#8c93a1'"
          />
          <text class="pill-label">{{ tab.label }}</text>
        </view>
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
  padding: 8rpx 10rpx;
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

.pill-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
}

.pill-item.active {
  background: #17181c;
}

.pill-label {
  font-size: 20rpx;
  font-weight: 700;
  letter-spacing: 0;
  color: #8c93a1;
}

.pill-item.active .pill-label {
  color: #ffffff;
}
</style>
