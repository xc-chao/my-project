<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AppHeader from '../../components/AppHeader.vue';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import {
  getAdminFeedback,
  getAdminOverview,
  updateAdminFeedback
} from '../../services/adminService';
import { useUserStore } from '../../store';
import type { AdminFeedbackItem, AdminOverview } from '../../mock/data';
import { ensureAdminPageAccess } from '../../utils/admin';

type FeedbackFilter = 'all' | 'pending' | 'resolved';

const userStore = useUserStore();
const loading = ref(false);
const feedbacks = ref<AdminFeedbackItem[]>([]);
const overview = ref<AdminOverview | null>(null);
const currentFilter = ref<FeedbackFilter>('all');
const filters: Array<{ key: FeedbackFilter; label: string }> = [
  { key: 'all', label: '全部反馈' },
  { key: 'pending', label: '待跟进' },
  { key: 'resolved', label: '已处理' }
];

const filteredFeedbacks = computed(() => {
  if (currentFilter.value === 'all') {
    return feedbacks.value;
  }

  return feedbacks.value.filter((item) => item.status === currentFilter.value);
});

const summaryCards = computed(() => {
  const pendingCount = feedbacks.value.filter((item) => item.status === 'pending').length;
  const resolvedCount = feedbacks.value.filter((item) => item.status === 'resolved').length;

  return [
    { label: '反馈总数', value: `${feedbacks.value.length}` },
    { label: '待跟进', value: `${pendingCount}` },
    { label: '已处理', value: `${resolvedCount}` }
  ];
});

async function loadData() {
  if (!ensureAdminPageAccess(userStore.isAdmin)) {
    return;
  }

  loading.value = true;

  try {
    const [feedbackList, overviewPayload] = await Promise.all([
      getAdminFeedback(),
      getAdminOverview()
    ]);

    feedbacks.value = feedbackList;
    overview.value = overviewPayload;
  } catch (error) {
    const message = error instanceof Error ? error.message : '反馈数据加载失败';
    uni.showToast({
      title: message,
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
}

function applyFeedback(updated: AdminFeedbackItem) {
  const index = feedbacks.value.findIndex((item) => item.id === updated.id);

  if (index > -1) {
    feedbacks.value[index] = updated;
  }
}

async function toggleFeedbackStatus(item: AdminFeedbackItem) {
  const nextStatus = item.status === 'pending' ? 'resolved' : 'pending';

  try {
    const updated = await updateAdminFeedback(item.id, {
      status: nextStatus
    });

    applyFeedback(updated);
    uni.showToast({
      title: nextStatus === 'resolved' ? '已标记处理' : '已重新打开',
      icon: 'none'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '反馈状态更新失败';
    uni.showToast({
      title: message,
      icon: 'none'
    });
  }
}

function goAdminHome() {
  uni.redirectTo({
    url: '/pages/admin/index'
  });
}

onMounted(loadData);
</script>

<template>
  <view class="page-shell">
    <AppHeader title="反馈与看板" back />

    <scroll-view scroll-y class="page-scroll">
      <view class="body">
        <view class="hero-card">
          <text class="hero-title">用户反馈与数据看板</text>
          <text class="hero-desc">在这里统一查看用户评价建议、热销商品排行，以及 Agent 调用监控数据。</text>
        </view>

        <view class="summary-row">
          <view v-for="item in summaryCards" :key="item.label" class="summary-card">
            <text class="summary-label">{{ item.label }}</text>
            <text class="summary-value">{{ item.value }}</text>
          </view>
        </view>

        <view class="section-card" v-if="overview">
          <text class="section-title">Agent 监控</text>
          <view class="monitor-grid">
            <view class="monitor-item">
              <text class="monitor-label">今日调用</text>
              <text class="monitor-value">{{ overview.monitor.todayCalls }}</text>
            </view>
            <view class="monitor-item">
              <text class="monitor-label">成功率</text>
              <text class="monitor-value">{{ overview.monitor.successRate }}%</text>
            </view>
            <view class="monitor-item">
              <text class="monitor-label">降级次数</text>
              <text class="monitor-value">{{ overview.monitor.fallbackCount }}</text>
            </view>
            <view class="monitor-item">
              <text class="monitor-label">平均耗时</text>
              <text class="monitor-value">{{ overview.monitor.avgLatencyMs }}ms</text>
            </view>
          </view>
        </view>

        <view class="section-card" v-if="overview">
          <text class="section-title">热销商品排行</text>
          <view class="hot-list">
            <view v-for="(item, index) in overview.hotProducts" :key="item.id" class="hot-item">
              <text class="hot-rank">{{ index + 1 }}</text>
              <view class="hot-copy">
                <text class="hot-title">{{ item.title }}</text>
                <text class="hot-desc">销量 {{ item.sales }} · 库存 {{ item.stock }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="filter-row">
          <view
            v-for="item in filters"
            :key="item.key"
            :class="['filter-pill', { active: currentFilter === item.key }]"
            @tap="currentFilter = item.key"
          >
            <text>{{ item.label }}</text>
          </view>
        </view>

        <view v-if="filteredFeedbacks.length" class="feedback-list">
          <view v-for="item in filteredFeedbacks" :key="item.id" class="feedback-card">
            <view class="feedback-head">
              <view class="feedback-copy">
                <text class="feedback-user">{{ item.userName }}</text>
                <text class="feedback-product">{{ item.productTitle }}</text>
              </view>
              <text :class="['status-pill', { resolved: item.status === 'resolved' }]">
                {{ item.status === 'resolved' ? '已处理' : '待跟进' }}
              </text>
            </view>

            <text class="feedback-summary">{{ item.summary }}</text>
            <view class="feedback-bottom">
              <text class="feedback-time">{{ item.createdAt }}</text>
              <view class="action-btn" @tap="toggleFeedbackStatus(item)">
                <text>{{ item.status === 'pending' ? '标记已处理' : '重新打开' }}</text>
              </view>
            </view>
          </view>
        </view>

        <EmptyStateCard
          v-else
          :title="loading ? '反馈加载中' : '当前筛选下暂无反馈'"
          :desc="loading ? '正在准备反馈列表，请稍候。' : '可以切换筛选查看其他处理状态。'"
          action-text="返回后台"
          @action="goAdminHome"
        />
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.page-scroll {
  height: calc(100vh - 120rpx);
}

.body {
  padding: 8rpx 40rpx 40rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.hero-card,
.summary-card,
.section-card,
.feedback-card {
  background: #ffffff;
}

.hero-card,
.section-card {
  padding: 28rpx;
  border-radius: 40rpx;
}

.hero-card {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.hero-title,
.section-title,
.feedback-user,
.hot-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #111111;
}

.hero-desc,
.summary-label,
.monitor-label,
.hot-desc,
.feedback-product,
.feedback-summary,
.feedback-time {
  font-size: 24rpx;
  line-height: 1.6;
  color: #6e7380;
}

.summary-row,
.filter-row,
.hot-list,
.feedback-list {
  display: flex;
}

.summary-row,
.filter-row {
  gap: 16rpx;
  flex-wrap: wrap;
}

.summary-card {
  flex: 1;
  min-width: calc(33.333% - 11rpx);
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 24rpx;
  border-radius: 28rpx;
}

.summary-value,
.monitor-value {
  font-size: 38rpx;
  font-weight: 700;
  color: #111111;
}

.monitor-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 18rpx;
}

.monitor-item {
  width: calc(50% - 8rpx);
  padding: 22rpx;
  border-radius: 28rpx;
  background: #f7f7fa;
}

.hot-list,
.feedback-list {
  flex-direction: column;
  gap: 16rpx;
  margin-top: 18rpx;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 20rpx 0;
  border-bottom: 1px solid #f0f1f4;
}

.hot-item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.hot-rank {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #17181c;
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 700;
  flex-shrink: 0;
}

.hot-copy,
.feedback-copy {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.filter-pill {
  padding: 16rpx 22rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #6e7380;
  font-size: 24rpx;
  font-weight: 600;
}

.filter-pill.active {
  background: #17181c;
  color: #ffffff;
}

.feedback-card {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  padding: 24rpx;
  border-radius: 32rpx;
}

.feedback-head,
.feedback-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.status-pill {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: rgba(225, 91, 77, 0.12);
  color: #e15b4d;
  font-size: 22rpx;
  font-weight: 700;
}

.status-pill.resolved {
  background: rgba(41, 135, 92, 0.12);
  color: #29875c;
}

.action-btn {
  min-width: 148rpx;
  height: 72rpx;
  padding: 0 24rpx;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #17181c;
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 700;
}
</style>
