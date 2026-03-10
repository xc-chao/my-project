<script setup lang="ts">
import { computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import PillTabBar from '../../components/PillTabBar.vue';
import { useUserStore } from '../../store';

const userStore = useUserStore();

const shortcuts = computed(() => [
  '地址管理',
  '历史订单',
  'AI 咨询记录',
  '售后申请'
]);

function handleLogin() {
  uni.navigateTo({
    url: '/pages/auth/login'
  });
}

onShow(() => {
  uni.hideTabBar();
});
</script>

<template>
  <view class="page-shell">
    <view class="header">
      <view class="status-row">
        <text class="time">9:41</text>
        <text class="signal">5G 100%</text>
      </view>
      <text class="title">我的</text>
    </view>

    <view class="content">
      <view class="profile-card" v-if="userStore.profile">
        <view class="avatar">{{ userStore.profile.nickname.slice(0, 1) }}</view>
        <view class="meta">
          <text class="nickname">{{ userStore.profile.nickname }}</text>
          <text class="phone">{{ userStore.profile.phone }}</text>
        </view>
      </view>

      <view v-else class="guest-card">
        <text class="nickname">游客模式</text>
        <text class="phone">登录后可同步订单、地址与聊天记录</text>
        <view class="login-btn" @tap="handleLogin">
          <text>立即登录</text>
        </view>
      </view>

      <view class="shortcut-card">
        <text class="section-title">常用服务</text>
        <view class="shortcut-list">
          <view v-for="item in shortcuts" :key="item" class="shortcut-item">
            <text>{{ item }}</text>
          </view>
        </view>
      </view>
    </view>

    <PillTabBar current="profile" />
  </view>
</template>

<style scoped lang="scss">
.header {
  padding: 0 40rpx 20rpx;
}

.status-row {
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.time {
  font-size: 30rpx;
  font-weight: 700;
}

.signal {
  font-size: 24rpx;
  font-weight: 600;
}

.title {
  font-size: 56rpx;
  font-weight: 700;
}

.content {
  padding: 0 40rpx 180rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.profile-card,
.guest-card,
.shortcut-card {
  background: #ffffff;
  border-radius: 48rpx;
  padding: 32rpx;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background: #17181c;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  font-weight: 700;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.nickname,
.section-title {
  font-size: 30rpx;
  font-weight: 700;
}

.phone {
  font-size: 24rpx;
  color: #6e7380;
}

.guest-card {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.login-btn {
  width: 220rpx;
  height: 88rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #17181c;
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 700;
}

.shortcut-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 18rpx;
}

.shortcut-item {
  padding: 22rpx 0;
  border-bottom: 1px solid #f1f2f4;
  font-size: 26rpx;
  color: #111111;
}
</style>
