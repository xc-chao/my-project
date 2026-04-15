<script setup lang="ts">
import { useUserStore } from '../../store';
import AppHeader from '../../components/AppHeader.vue';
import { pageImageMap } from '../../constants/page-image-map';
import type { UserRole } from '../../types/domain';

const userStore = useUserStore();
const supportVisuals = pageImageMap.auth.support;
const trustAvatars = pageImageMap.auth.trustAvatars;

async function handleLogin(identity: UserRole = 'user') {
  await userStore.login(identity);
  uni.switchTab({
    url: identity === 'admin' ? '/pages/profile/index' : '/pages/home/index'
  });
}

function handlePhoneLogin() {
  handleLogin('user');
}

function handleAdminLogin() {
  handleLogin('admin');
}
</script>

<template>
  <view class="page-shell">
    <AppHeader title="" />

    <view class="body">
      <view class="hero-card">
        <image class="hero-image" :src="pageImageMap.auth.hero" mode="aspectFill" />
        <view class="hero-grid">
          <image
            v-for="item in supportVisuals"
            :key="item"
            class="hero-grid-image"
            :src="item"
            mode="aspectFill"
          />
        </view>
        <text class="hero-label">欢迎回来</text>
        <text class="hero-title">智能购物小程序</text>
        <text class="hero-text">
          覆盖商品浏览、智能咨询、购物车与订单闭环，首轮实现先按 Pencil 页面逐步落地。
        </text>
        <view class="trust-row">
          <view class="trust-avatars">
            <image v-for="item in trustAvatars" :key="item" class="trust-avatar" :src="item" mode="aspectFill" />
          </view>
          <text class="trust-text">12k+ 校园用户正在浏览球鞋与街头单品</text>
        </view>
      </view>

      <button class="primary-btn" :loading="userStore.loading" @tap="handleLogin('user')">
        微信一键登录
      </button>
      <button class="secondary-btn" @tap="handlePhoneLogin">手机号验证码登录</button>
      <view class="admin-entry" @tap="handleAdminLogin">
        <text class="admin-entry-title">管理员演示登录</text>
        <text class="admin-entry-desc">登录后可在“我的”页订单状态下方查看后台信息管理入口</text>
      </view>

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
  padding: 32rpx;
}

.tips-card {
  background: #ffffff;
}

.admin-entry {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding: 24rpx 28rpx;
  border-radius: 32rpx;
  background: rgba(23, 24, 28, 0.04);
  border: 1px solid rgba(23, 24, 28, 0.08);
}

.admin-entry-title {
  font-size: 26rpx;
  font-weight: 700;
  color: #111111;
}

.admin-entry-desc {
  font-size: 22rpx;
  line-height: 1.6;
  color: #6e7380;
}

.hero-image {
  width: 100%;
  height: 240rpx;
  border-radius: 36rpx;
  background: #eef0f4;
}

.hero-grid {
  display: flex;
  gap: 16rpx;
  margin-top: 16rpx;
}

.hero-grid-image {
  flex: 1;
  height: 148rpx;
  border-radius: 28rpx;
  background: #eef0f4;
}

.hero-label {
  display: inline-flex;
  align-self: flex-start;
  margin-top: 24rpx;
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

.trust-row {
  display: flex;
  align-items: center;
  gap: 18rpx;
  margin-top: 24rpx;
}

.trust-avatars {
  display: flex;
}

.trust-avatar {
  width: 52rpx;
  height: 52rpx;
  margin-right: -12rpx;
  border-radius: 50%;
  border: 4rpx solid #ffffff;
  background: #eef0f4;
}

.trust-text {
  flex: 1;
  font-size: 22rpx;
  line-height: 1.5;
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
