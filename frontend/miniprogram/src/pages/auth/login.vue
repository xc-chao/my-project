<script setup lang="ts">
import { useUserStore } from '../../store';
import AppHeader from '../../components/AppHeader.vue';

const userStore = useUserStore();

async function handleLogin() {
  await userStore.login();
  uni.switchTab({
    url: '/pages/home/index'
  });
}
</script>

<template>
  <view class="page-shell">
    <AppHeader title="" />

    <view class="body">
      <view class="hero-card">
        <text class="hero-label">AI 驱动购物体验</text>
        <text class="hero-title">智能购物小程序</text>
        <text class="hero-text">
          覆盖商品浏览、智能咨询、购物车与订单闭环，首轮实现先按 Pencil 页面逐步落地。
        </text>
      </view>

      <button class="primary-btn" :loading="userStore.loading" @tap="handleLogin">
        微信一键登录
      </button>
      <button class="secondary-btn">手机号验证码登录</button>

      <view class="tips-card">
        <text class="tips-title">登录后可获得</text>
        <text class="tips-item">商品上下文 AI 咨询</text>
        <text class="tips-item">购物车和订单同步</text>
        <text class="tips-item">地址管理与售后记录</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.body {
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 40rpx;
}

.hero-card,
.tips-card {
  border-radius: 56rpx;
  background: linear-gradient(135deg, #ffffff 0%, #f2f4f8 60%, #e9eef8 100%);
  padding: 40rpx;
}

.tips-card {
  background: #ffffff;
}

.hero-label {
  display: inline-flex;
  align-self: flex-start;
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #6e7380;
  font-size: 22rpx;
  font-weight: 600;
}

.hero-title {
  display: block;
  margin-top: 24rpx;
  font-size: 52rpx;
  font-weight: 700;
  color: #111111;
}

.hero-text,
.tips-item {
  display: block;
  margin-top: 16rpx;
  font-size: 26rpx;
  line-height: 1.6;
  color: #6e7380;
}

.primary-btn,
.secondary-btn {
  width: 100%;
  height: 112rpx;
  border-radius: 56rpx;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 112rpx;
}

.primary-btn {
  color: #ffffff;
  background: #17181c;
}

.secondary-btn {
  color: #111111;
  background: #ffffff;
  border: 1px solid #e7e9ee;
}

.tips-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #111111;
}
</style>
