<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppHeader from '../../components/AppHeader.vue';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import { getAdminOverview } from '../../services/adminService';
import { useUserStore } from '../../store';
import type { AdminOverview } from '../../mock/data';
import { ensureAdminPageAccess } from '../../utils/admin';

const userStore = useUserStore();
const loading = ref(false);
const overview = ref<AdminOverview | null>(null);

function ensureAdminAccess() {
  return ensureAdminPageAccess(userStore.isAdmin);
}

async function loadOverview() {
  if (!ensureAdminAccess()) {
    return;
  }

  loading.value = true;

  try {
    overview.value = await getAdminOverview();
  } catch (error) {
    const message = error instanceof Error ? error.message : '后台数据加载失败';
    uni.showToast({
      title: message,
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
}

function openModule(key: AdminOverview['modules'][number]['key']) {
  const routeMap = {
    product: '/pages/admin/products',
    order: '/pages/admin/orders',
    feedback: '/pages/admin/feedback'
  } as const;

  uni.navigateTo({
    url: routeMap[key]
  });
}

function goProfile() {
  uni.switchTab({
    url: '/pages/profile/index'
  });
}

onMounted(loadOverview);
</script>

<template>
  <view class="page-shell">
    <AppHeader title="后台管理" back />

    <scroll-view scroll-y class="page-scroll">
      <view v-if="overview" class="body">
        <view class="hero-card">
          <text class="hero-eyebrow">Admin Console</text>
          <text class="hero-title">后台信息管理</text>
          <text class="hero-desc">
            对商品、订单、售后与反馈做集中管理，当前版本已拆出商品管理、订单处理与反馈看板子页。
          </text>
        </view>

        <view class="metric-grid">
          <view
            v-for="item in overview.metrics"
            :key="item.label"
            :class="['metric-card', { danger: item.accent === 'danger' }]"
          >
            <text class="metric-label">{{ item.label }}</text>
            <text class="metric-value">{{ item.value }}</text>
            <text class="metric-hint">{{ item.hint }}</text>
          </view>
        </view>

        <view class="section-card">
          <text class="section-title">管理模块</text>
          <view class="module-list">
            <view
              v-for="item in overview.modules"
              :key="item.key"
              class="module-card"
              @tap="openModule(item.key)"
            >
              <view class="module-main">
                <text class="module-title">{{ item.title }}</text>
                <text class="module-desc">{{ item.desc }}</text>
              </view>
              <view class="module-side">
                <text class="module-value">{{ item.value }}</text>
                <text class="module-hint">{{ item.hint }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="section-card">
          <text class="section-title">热销商品排行</text>
          <view class="rank-list">
            <view v-for="(item, index) in overview.hotProducts" :key="item.id" class="rank-item">
              <view class="rank-badge">
                <text>{{ index + 1 }}</text>
              </view>
              <view class="rank-copy">
                <text class="rank-title">{{ item.title }}</text>
                <text class="rank-desc">销量 {{ item.sales }} · 库存 {{ item.stock }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="section-card">
          <text class="section-title">最近反馈</text>
          <view class="feedback-list">
            <view v-for="item in overview.feedbacks" :key="item.id" class="feedback-item">
              <view class="feedback-head">
                <text class="feedback-user">{{ item.userName }}</text>
                <text :class="['feedback-status', { resolved: item.status === 'resolved' }]">
                  {{ item.status === 'resolved' ? '已处理' : '待跟进' }}
                </text>
              </view>
              <text class="feedback-product">{{ item.productTitle }}</text>
              <text class="feedback-summary">{{ item.summary }}</text>
              <text class="feedback-time">{{ item.createdAt }}</text>
            </view>
          </view>
        </view>

        <view class="section-card">
          <text class="section-title">Agent 监控</text>
          <view class="monitor-grid">
            <view class="monitor-item">
              <text class="monitor-label">今日调用</text>
              <text class="monitor-value">{{ overview.monitor.todayCalls }}</text>
            </view>
            <view class="monitor-item">
              <text class="monitor-label">降级次数</text>
              <text class="monitor-value">{{ overview.monitor.fallbackCount }}</text>
            </view>
            <view class="monitor-item">
              <text class="monitor-label">成功率</text>
              <text class="monitor-value">{{ overview.monitor.successRate }}%</text>
            </view>
            <view class="monitor-item">
              <text class="monitor-label">平均耗时</text>
              <text class="monitor-value">{{ overview.monitor.avgLatencyMs }}ms</text>
            </view>
          </view>
        </view>
      </view>

      <view v-else class="empty-wrap">
        <EmptyStateCard
          :title="loading ? '后台数据加载中' : '暂无后台数据'"
          :desc="loading ? '正在准备管理员概览，请稍候。' : '可以稍后重试，或先返回我的页面。'"
          action-text="返回我的"
          @action="goProfile"
        />
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.page-scroll {
  height: calc(100vh - 120rpx);
}

.body,
.empty-wrap {
  padding: 8rpx 40rpx 40rpx;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 22rpx;
}

.hero-card,
.section-card {
  padding: 30rpx;
  border-radius: 40rpx;
  background: #ffffff;
}

.hero-card {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  background: linear-gradient(135deg, #ffffff 0%, #f5f6fa 55%, #eef1f7 100%);
}

.hero-eyebrow {
  font-size: 22rpx;
  font-weight: 700;
  color: #8c93a1;
  letter-spacing: 2rpx;
}

.hero-title,
.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #111111;
}

.hero-desc,
.metric-hint,
.module-desc,
.module-hint,
.rank-desc,
.feedback-summary,
.feedback-time,
.monitor-label {
  font-size: 24rpx;
  line-height: 1.6;
  color: #6e7380;
}

.metric-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 18rpx;
}

.metric-card {
  width: calc(50% - 9rpx);
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 26rpx;
  border-radius: 32rpx;
  background: #ffffff;
}

.metric-card.danger .metric-value {
  color: #e15b4d;
}

.metric-label {
  font-size: 24rpx;
  font-weight: 700;
  color: #111111;
}

.metric-value,
.monitor-value {
  font-size: 52rpx;
  font-weight: 700;
  color: #111111;
}

.section-title {
  display: block;
}

.module-list,
.rank-list,
.feedback-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 18rpx;
}

.module-card,
.rank-item,
.feedback-item,
.monitor-item {
  border-radius: 28rpx;
  background: #f7f7fa;
}

.module-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
  padding: 24rpx;
}

.module-main,
.module-side,
.rank-copy {
  display: flex;
  flex-direction: column;
}

.module-main {
  flex: 1;
  gap: 8rpx;
}

.module-side {
  align-items: flex-end;
  gap: 8rpx;
  max-width: 220rpx;
}

.module-title,
.rank-title,
.feedback-user,
.feedback-product {
  font-size: 28rpx;
  font-weight: 700;
  color: #111111;
}

.module-value {
  font-size: 24rpx;
  font-weight: 700;
  color: #111111;
  text-align: right;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 24rpx;
}

.rank-badge {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #17181c;
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 700;
  flex-shrink: 0;
}

.rank-copy {
  gap: 8rpx;
}

.feedback-item {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 24rpx;
}

.feedback-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.feedback-status {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: rgba(225, 91, 77, 0.12);
  color: #e15b4d;
  font-size: 22rpx;
  font-weight: 700;
}

.feedback-status.resolved {
  background: rgba(41, 135, 92, 0.12);
  color: #29875c;
}

.monitor-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 18rpx;
}

.monitor-item {
  width: calc(50% - 8rpx);
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding: 24rpx;
}
</style>
