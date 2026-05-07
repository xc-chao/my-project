<script setup lang="ts">
import { useUserStore } from '../../store';
import { pageImageMap } from '../../constants/page-image-map';
import type { UserRole } from '../../types/domain';

const userStore = useUserStore();
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0;
const supportVisuals = pageImageMap.auth.support;
const trustAvatars = pageImageMap.auth.trustAvatars;
const isH5 = process.env.UNI_PLATFORM === 'h5';

async function handleLogin() {
  try {
    await userStore.login();
    const target = userStore.isAdmin ? '/pages/admin/index' : '/pages/home/index';
    if (userStore.isAdmin) {
      uni.reLaunch({ url: target });
    } else {
      uni.switchTab({ url: target });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : '登录失败';
    uni.showToast({
      title: message,
      icon: 'none'
    });
  }
}

async function handleDevLogin(role: UserRole) {
  try {
    await userStore.devLogin(role);
    const target = userStore.isAdmin ? '/pages/admin/index' : '/pages/home/index';
    if (userStore.isAdmin) {
      uni.navigateTo({ url: target });
    } else {
      uni.switchTab({ url: target });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : '登录失败';
    uni.showToast({
      title: message,
      icon: 'none'
    });
  }
}

function goHome() {
  uni.switchTab({
    url: '/pages/home/index'
  });
}
</script>

<template>
  <view class="page-shell login-shell" :style="{ paddingTop: `${statusBarHeight}px` }">
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
          微信一键登录后自动识别身份，管理员进入后台，普通用户进入买家端。
        </text>
        <view class="trust-row">
          <view class="trust-avatars">
            <image v-for="item in trustAvatars" :key="item" class="trust-avatar" :src="item" mode="aspectFill" />
          </view>
          <text class="trust-text">登录即用，无需再选角色。</text>
        </view>
      </view>

      <view class="primary-btn" :class="{ loading: userStore.loading }" @tap="handleLogin">
        <text>{{ userStore.loading ? '登录中...' : '微信一键登录' }}</text>
      </view>

      <view v-if="isH5" class="dev-login-row">
        <view class="dev-login-btn" @tap="handleDevLogin('user')">
          <text>买家测试登录</text>
        </view>
        <view class="dev-login-btn admin" @tap="handleDevLogin('admin')">
          <text>管理员测试登录</text>
        </view>
      </view>

      <view class="secondary-btn" @tap="goHome">
        <text>先逛一逛</text>
      </view>

      <view class="tips-card">
        <text class="tips-title">登录后可获得</text>
        <text class="tips-item">商品浏览、AI 咨询</text>
        <text class="tips-item">购物车和订单同步</text>
        <text class="tips-item">管理员自动进入后台</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.login-shell {
  min-height: 100vh;
}

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

.primary-btn {
  width: 100%;
  height: 112rpx;
  border-radius: 56rpx;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 112rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: #17181c;
}

.primary-btn.loading {
  opacity: 0.75;
}

.secondary-btn {
  width: 100%;
  height: 112rpx;
  border-radius: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111111;
  background: #ffffff;
  border: 1px solid #e7e9ee;
  font-size: 30rpx;
  font-weight: 700;
}

.dev-login-row {
  display: flex;
  gap: 20rpx;
}

.dev-login-btn {
  flex: 1;
  height: 96rpx;
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111111;
  background: #ffffff;
  border: 1px solid #dfe3ea;
  font-size: 26rpx;
  font-weight: 700;
}

.dev-login-btn.admin {
  color: #ffffff;
  background: #2f5cff;
  border-color: #2f5cff;
}

.tips-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #111111;
}
</style>
