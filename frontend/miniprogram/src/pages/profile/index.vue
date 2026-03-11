<script setup lang="ts">
import { computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import PillTabBar from '../../components/PillTabBar.vue';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import { useUserStore } from '../../store';

const userStore = useUserStore();

const shortcuts = computed(() => [
  {
    label: '地址管理',
    path: '/pages/address/index'
  },
  {
    label: '历史订单',
    path: '/pages/order/list'
  },
  {
    label: 'AI 咨询记录',
    path: '/pages/chat/index?mode=history&productId=p_001&title=%E5%92%A8%E8%AF%A2%E8%AE%B0%E5%BD%95'
  },
  {
    label: '售后申请',
    path: '/pages/after-sale/index'
  }
]);

function handleLogin() {
  uni.navigateTo({
    url: '/pages/auth/login'
  });
}

function openShortcut(path: string) {
  uni.navigateTo({
    url: path
  });
}

onShow(() => {
  uni.hideTabBar();
});
</script>

<template>
  <view class="page-shell">
    <view class="header">
      <text class="title">我的</text>
    </view>

    <view class="content">
      <view class="profile-card" v-if="userStore.profile">
        <image class="avatar" :src="userStore.profile.avatar" mode="aspectFill" />
        <view class="meta">
          <text class="nickname">{{ userStore.profile.nickname }}</text>
          <text class="phone">{{ userStore.profile.phone }}</text>
        </view>
        <view class="status-pill">
          <text>会员成长中</text>
        </view>
      </view>

      <EmptyStateCard
        v-else
        title="游客模式"
        desc="登录后可同步订单、地址、售后与 AI 咨询记录。"
        action-text="立即登录"
        @action="handleLogin"
      />

      <view class="shortcut-card">
        <text class="section-title">常用服务</text>
        <view class="shortcut-list">
          <view
            v-for="item in shortcuts"
            :key="item.label"
            class="shortcut-item"
            @tap="openShortcut(item.path)"
          >
            <text>{{ item.label }}</text>
            <text class="arrow">&gt;</text>
          </view>
        </view>
      </view>

      <view class="shortcut-card">
        <text class="section-title">订单状态</text>
        <view class="order-grid">
          <view class="order-pill" @tap="openShortcut('/pages/order/list')">
            <text class="order-title">全部订单</text>
            <text class="order-desc">查看支付与物流状态</text>
          </view>
          <view class="order-pill" @tap="openShortcut('/pages/after-sale/index')">
            <text class="order-title">售后进度</text>
            <text class="order-desc">查看处理结果与备注</text>
          </view>
        </view>
      </view>
    </view>

    <PillTabBar current="profile" />
  </view>
</template>

<style scoped lang="scss">
.header {
  padding: 20rpx 40rpx 20rpx;
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
.shortcut-card {
  background: #ffffff;
  border-radius: 48rpx;
  padding: 32rpx;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  flex-wrap: wrap;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background: #eef0f4;
}

.meta {
  flex: 1;
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

.status-pill {
  padding: 12rpx 18rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f8;
  color: #111111;
  font-size: 22rpx;
  font-weight: 700;
}

.shortcut-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 18rpx;
}

.shortcut-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22rpx 0;
  border-bottom: 1px solid #f1f2f4;
  font-size: 26rpx;
  color: #111111;
}

.arrow,
.order-desc {
  font-size: 24rpx;
  color: #8c93a1;
}

.order-grid {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 18rpx;
}

.order-pill {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 24rpx;
  border-radius: 28rpx;
  background: #f7f7fa;
}

.order-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #111111;
}
</style>
