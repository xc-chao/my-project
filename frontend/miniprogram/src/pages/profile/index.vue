<script setup lang="ts">
import { computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import PillTabBar from '../../components/PillTabBar.vue';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import { pageImageMap } from '../../constants/page-image-map';
import { useUserStore } from '../../store';

const userStore = useUserStore();
const profileBanner = pageImageMap.profile.banner;

const shortcuts = computed(() => [
  {
    label: '地址管理',
    desc: pageImageMap.profile.services[0].desc,
    image: pageImageMap.profile.services[0].image,
    path: '/pages/address/index'
  },
  {
    label: '历史订单',
    desc: pageImageMap.profile.services[1].desc,
    image: pageImageMap.profile.services[1].image,
    path: '/pages/order/list'
  },
  {
    label: 'AI 咨询记录',
    desc: pageImageMap.profile.services[2].desc,
    image: pageImageMap.profile.services[2].image,
    path: '/pages/chat/index?mode=history&productId=p_001&title=%E5%92%A8%E8%AF%A2%E8%AE%B0%E5%BD%95'
  },
  {
    label: '售后申请',
    desc: pageImageMap.profile.services[3].desc,
    image: pageImageMap.profile.services[3].image,
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

function openProfileAccount() {
  if (!userStore.profile) {
    handleLogin();
    return;
  }

  uni.navigateTo({
    url: '/pages/profile/account'
  });
}

onShow(() => {
  uni.hideTabBar();
});
</script>

<template>
  <view class="page-shell">
    <view class="content">
      <view class="profile-card" v-if="userStore.profile" @tap="openProfileAccount">
        <image class="profile-cover" :src="profileBanner" mode="aspectFill" />
        <image class="avatar" :src="userStore.profile.avatar" mode="aspectFill" />
        <view class="meta">
          <text class="nickname">{{ userStore.profile.nickname }}</text>
          <text class="profile-tip">点击头像或资料卡，进入个人信息管理</text>
        </view>
        <view class="status-pill">
          <text>{{ userStore.isAdmin ? '管理员身份' : '会员成长中' }}</text>
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
        <view class="service-grid">
          <view
            v-for="item in shortcuts"
            :key="item.label"
            class="service-card"
            @tap="openShortcut(item.path)"
          >
            <image class="service-image" :src="item.image" mode="aspectFill" />
            <text class="service-title">{{ item.label }}</text>
            <text class="service-desc">{{ item.desc }}</text>
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

      <view v-if="userStore.profile" class="shortcut-card">
        <text class="section-title">账号与安全</text>
        <view class="order-grid">
          <view class="order-pill" @tap="openProfileAccount">
            <text class="order-title">个人信息管理</text>
            <text class="order-desc">修改昵称、演示身份、头像与退出当前登录</text>
          </view>
        </view>
      </view>

      <view v-if="userStore.isAdmin" class="shortcut-card admin-entry-card" @tap="openShortcut('/pages/admin/index')">
        <view class="admin-entry-head">
          <view class="admin-entry-copy">
            <text class="section-title">后台信息管理</text>
            <text class="admin-entry-desc">仅管理员可见，集中查看商品管理、订单处理、用户反馈与数据看板。</text>
          </view>
          <view class="admin-entry-pill">
            <text>管理员</text>
          </view>
        </view>
        <view class="admin-preview-list">
          <view class="admin-preview-item">
            <text class="admin-preview-title">商品管理</text>
            <text class="admin-preview-copy">新增商品、上下架、库存维护与图文描述。</text>
          </view>
          <view class="admin-preview-item">
            <text class="admin-preview-title">订单处理</text>
            <text class="admin-preview-copy">发货审核、状态流转、售后审批与日志记录。</text>
          </view>
          <view class="admin-preview-item">
            <text class="admin-preview-title">用户反馈与数据看板</text>
            <text class="admin-preview-copy">查看评价反馈、热销排行、订单趋势与 Agent 调用监控。</text>
          </view>
        </view>
      </view>
    </view>

    <PillTabBar current="profile" />
  </view>
</template>

<style scoped lang="scss">
.page-shell {
  padding: 20rpx 0rpx 20rpx;
}

.title {
  font-size: 56rpx;
  font-weight: 700;
}

.content {
  padding: 0 40rpx calc(220rpx + env(safe-area-inset-bottom));
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
  overflow: hidden;
  position: relative;
}

.profile-cover {
  width: calc(100% + 64rpx);
  height: 220rpx;
  margin: -32rpx -32rpx 0;
  border-radius: 40rpx;
  background: #eef0f4;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background: #eef0f4;
  margin-top: -56rpx;
  border: 6rpx solid #ffffff;
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

.profile-tip {
  font-size: 22rpx;
  color: #8c93a1;
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

.profile-action {
  padding: 12rpx 18rpx;
  border-radius: 999rpx;
  background: #17181c;
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 700;
}

.service-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 18rpx;
  margin-top: 18rpx;
}

.service-card {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  width: calc((100% - 18rpx) / 2);
  box-sizing: border-box;
  padding: 18rpx;
  border-radius: 28rpx;
  background: #f7f7fa;
}

.service-image {
  width: 100%;
  height: 150rpx;
  border-radius: 22rpx;
  background: #eef0f4;
}

.service-title {
  font-size: 26rpx;
  font-weight: 700;
  color: #111111;
}

.service-desc,
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

.admin-entry-card {
  gap: 20rpx;
}

.admin-entry-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.admin-entry-copy {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.admin-entry-desc,
.admin-preview-copy {
  font-size: 24rpx;
  line-height: 1.6;
  color: #6e7380;
}

.admin-entry-pill {
  padding: 12rpx 18rpx;
  border-radius: 999rpx;
  background: #17181c;
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 700;
}

.admin-preview-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 18rpx;
}

.admin-preview-item {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 24rpx;
  border-radius: 28rpx;
  background: #f7f7fa;
}

.admin-preview-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #111111;
}
</style>
