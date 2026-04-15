<script setup lang="ts">
import { computed, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import {
  getAdminFeedback,
  getAdminOverview,
  updateAdminFeedback
} from '../../services/adminService';
import { useUserStore } from '../../store';
import type { AdminFeedbackItem, AdminOverview, AdminTrendRange } from '../../types/domain';
import { ensureAdminPageAccess } from '../../utils/admin';

type FeedbackFilter = 'all' | 'pending' | 'resolved';

const userStore = useUserStore();
const loading = ref(false);
const feedbacks = ref<AdminFeedbackItem[]>([]);
const overview = ref<AdminOverview | null>(null);
const currentFilter = ref<FeedbackFilter>('all');
const trendRange = ref<AdminTrendRange>('7d');
const filters: Array<{ key: FeedbackFilter; label: string }> = [
  { key: 'all', label: '全部反馈' },
  { key: 'pending', label: '待跟进' },
  { key: 'resolved', label: '已处理' }
];
const trendRanges: Array<{ key: AdminTrendRange; label: string }> = [
  { key: '7d', label: '近 7 天' },
  { key: '30d', label: '近 30 天' }
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

function getChartPercent(value: number, max: number, min = 12) {
  if (!max) {
    return `${min}%`;
  }

  return `${Math.max((value / max) * 100, min)}%`;
}

function getTrendCanvasWidth(length: number) {
  return length > 10 ? `${Math.max(length * 72, 760)}rpx` : '100%';
}

const currentRangeLabel = computed(() => (trendRange.value === '30d' ? '30 日' : '7 日'));

const orderTrend = computed(() => {
  const list = overview.value?.charts.orderTrend[trendRange.value] || [];
  const max = Math.max(...list.map((item) => item.value), 1);

  return list.map((item) => ({
    ...item,
    height: getChartPercent(item.value, max)
  }));
});

const agentTrend = computed(() => {
  const list = overview.value?.charts.agentTrend[trendRange.value] || [];
  const max = Math.max(...list.map((item) => item.value), 1);

  return list.map((item) => ({
    ...item,
    height: getChartPercent(item.value, max)
  }));
});

const hotRanking = computed(() => {
  const list = overview.value?.hotProducts || [];
  const max = Math.max(...list.map((item) => item.sales), 1);

  return list.map((item, index) => ({
    ...item,
    rank: index + 1,
    width: getChartPercent(item.sales, max, 18)
  }));
});

const categoryRanking = computed(() => {
  const list = overview.value?.rankings.categorySales || [];
  const max = Math.max(...list.map((item) => item.value), 1);

  return list.map((item, index) => ({
    ...item,
    rank: index + 1,
    width: getChartPercent(item.value, max, 18)
  }));
});

const afterSaleReasonRanking = computed(() => {
  const list = overview.value?.rankings.afterSaleReasons || [];
  const max = Math.max(...list.map((item) => item.value), 1);

  return list.map((item, index) => ({
    ...item,
    rank: index + 1,
    width: getChartPercent(item.value, max, 18)
  }));
});

function parseFeedbackDate(value: string) {
  return new Date(value.replace(/-/g, '/'));
}

function formatMonthDay(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${month}/${day}`;
}

const feedbackTrend = computed(() => {
  const source = feedbacks.value;
  const dayCount = trendRange.value === '30d' ? 30 : 7;
  const latestDate =
    source.length > 0
      ? source.reduce((latest, item) => {
          const current = parseFeedbackDate(item.createdAt);
          return current.getTime() > latest.getTime() ? current : latest;
        }, parseFeedbackDate(source[0].createdAt))
      : new Date();

  const buckets = Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(latestDate);
    date.setDate(latestDate.getDate() - (dayCount - index - 1));

    return {
      label: formatMonthDay(date),
      pending: 0,
      resolved: 0
    };
  });
  const labelMap = new Map(buckets.map((item) => [item.label, item]));

  source.forEach((item) => {
    const label = formatMonthDay(parseFeedbackDate(item.createdAt));
    const target = labelMap.get(label);

    if (!target) {
      return;
    }

    if (item.status === 'pending') {
      target.pending += 1;
      return;
    }

    target.resolved += 1;
  });

  const max = Math.max(...buckets.map((item) => Math.max(item.pending, item.resolved)), 1);

  return buckets.map((item) => ({
    ...item,
    pendingHeight: getChartPercent(item.pending, max),
    resolvedHeight: getChartPercent(item.resolved, max)
  }));
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

    feedbacks.value = feedbackList.map((item) => ({ ...item }));
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
  feedbacks.value = feedbacks.value.map((item) => (item.id === updated.id ? { ...updated } : item));
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

onShow(loadData);
</script>

<template>
  <view class="page-shell">
    <AppHeader title="反馈与看板" back />

    <scroll-view scroll-y class="page-scroll">
      <view class="body">
        <view class="hero-card">
          <text class="hero-title">用户反馈与数据看板</text>
          <text class="hero-desc">在这里统一查看反馈处理、趋势变化、分类排行与 Agent 调用表现。</text>
        </view>

        <view class="summary-row">
          <view v-for="item in summaryCards" :key="item.label" class="summary-card">
            <text class="summary-label">{{ item.label }}</text>
            <text class="summary-value">{{ item.value }}</text>
          </view>
        </view>

        <view class="dashboard-toolbar">
          <text class="toolbar-title">趋势周期</text>
          <view class="range-switch">
            <view
              v-for="item in trendRanges"
              :key="item.key"
              :class="['range-pill', { active: trendRange === item.key }]"
              @tap="trendRange = item.key"
            >
              <text>{{ item.label }}</text>
            </view>
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
          <view class="chart-block">
            <view class="chart-head">
              <text class="chart-title">近 {{ currentRangeLabel }} Agent 调用趋势</text>
              <text class="chart-note">纵向柱高表示每日调用量</text>
            </view>
            <scroll-view scroll-x class="chart-scroll">
              <view class="bar-chart" :style="{ width: getTrendCanvasWidth(agentTrend.length) }">
                <view v-for="item in agentTrend" :key="`agent-${item.label}`" class="chart-column">
                  <text class="chart-value">{{ item.value }}</text>
                  <view class="chart-track">
                    <view class="chart-bar dark" :style="{ height: item.height }" />
                  </view>
                  <text class="chart-label">{{ item.label }}</text>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>

        <view class="section-card" v-if="overview">
          <text class="section-title">趋势看板</text>
          <view class="chart-stack">
            <view class="chart-block">
              <view class="chart-head">
                <text class="chart-title">近 {{ currentRangeLabel }}订单趋势</text>
                <text class="chart-note">用于观察订单量变化</text>
              </view>
              <scroll-view scroll-x class="chart-scroll">
                <view class="bar-chart" :style="{ width: getTrendCanvasWidth(orderTrend.length) }">
                  <view v-for="item in orderTrend" :key="`order-${item.label}`" class="chart-column">
                    <text class="chart-value">{{ item.value }}</text>
                    <view class="chart-track">
                      <view class="chart-bar warm" :style="{ height: item.height }" />
                    </view>
                    <text class="chart-label">{{ item.label }}</text>
                  </view>
                </view>
              </scroll-view>
            </view>

            <view class="chart-block">
              <view class="chart-head">
                <text class="chart-title">近 {{ currentRangeLabel }}反馈处理趋势</text>
                <view class="legend-row">
                  <view class="legend-item">
                    <view class="legend-dot pending" />
                    <text>待跟进</text>
                  </view>
                  <view class="legend-item">
                    <view class="legend-dot resolved" />
                    <text>已处理</text>
                  </view>
                </view>
              </view>
              <scroll-view scroll-x class="chart-scroll">
                <view class="bar-chart grouped" :style="{ width: getTrendCanvasWidth(feedbackTrend.length) }">
                  <view
                    v-for="item in feedbackTrend"
                    :key="`feedback-${item.label}`"
                    class="chart-column grouped-column"
                  >
                    <text class="chart-value">{{ item.pending }}/{{ item.resolved }}</text>
                    <view class="chart-track grouped-track">
                      <view class="chart-group">
                        <view class="chart-bar pending" :style="{ height: item.pendingHeight }" />
                        <view class="chart-bar resolved" :style="{ height: item.resolvedHeight }" />
                      </view>
                    </view>
                    <text class="chart-label">{{ item.label }}</text>
                  </view>
                </view>
              </scroll-view>
            </view>
          </view>
        </view>

        <view class="section-card" v-if="overview">
          <view class="chart-head">
            <text class="section-title">热销排行图表</text>
            <text class="chart-note">横向长度代表销量热度</text>
          </view>
          <view class="rank-chart">
            <view v-for="item in hotRanking" :key="item.id" class="rank-row">
              <view class="rank-row-head">
                <view class="rank-main">
                  <text class="rank-index">{{ item.rank }}</text>
                  <text class="rank-name">{{ item.title }}</text>
                </view>
                <text class="rank-number">{{ item.sales }}</text>
              </view>
              <view class="rank-track">
                <view class="rank-fill" :style="{ width: item.width }" />
              </view>
              <text class="rank-desc">库存 {{ item.stock }}</text>
            </view>
          </view>
        </view>

        <view class="section-card" v-if="overview">
          <view class="chart-head">
            <text class="section-title">运营排行</text>
            <text class="chart-note">按分类热度与售后问题聚合</text>
          </view>
          <view class="rank-grid">
            <view class="chart-block rank-panel">
              <view class="chart-head">
                <text class="chart-title">分类销量排行</text>
                <text class="chart-note">累计销量聚合</text>
              </view>
              <view class="rank-chart compact">
                <view v-for="item in categoryRanking" :key="item.label" class="rank-row">
                  <view class="rank-row-head">
                    <view class="rank-main">
                      <text class="rank-index">{{ item.rank }}</text>
                      <text class="rank-name">{{ item.label }}</text>
                    </view>
                    <text class="rank-number">{{ item.value }}</text>
                  </view>
                  <view class="rank-track">
                    <view class="rank-fill category" :style="{ width: item.width }" />
                  </view>
                  <text class="rank-desc">{{ item.note }}</text>
                </view>
              </view>
            </view>

            <view class="chart-block rank-panel">
              <view class="chart-head">
                <text class="chart-title">售后原因排行</text>
                <text class="chart-note">高频问题聚合</text>
              </view>
              <view class="rank-chart compact">
                <view v-for="item in afterSaleReasonRanking" :key="item.label" class="rank-row">
                  <view class="rank-row-head">
                    <view class="rank-main">
                      <text class="rank-index">{{ item.rank }}</text>
                      <text class="rank-name">{{ item.label }}</text>
                    </view>
                    <text class="rank-number">{{ item.value }}</text>
                  </view>
                  <view class="rank-track">
                    <view class="rank-fill reason" :style="{ width: item.width }" />
                  </view>
                  <text class="rank-desc">{{ item.note }}</text>
                </view>
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
              <text
                :key="`feedback-status-${item.id}-${item.status}`"
                :class="['status-pill', { resolved: item.status === 'resolved' }]"
              >
                {{ item.status === 'resolved' ? '已处理' : '待跟进' }}
              </text>
            </view>

            <text class="feedback-summary">{{ item.summary }}</text>
            <view class="feedback-bottom">
              <text class="feedback-time">{{ item.createdAt }}</text>
              <view
                :key="`feedback-action-${item.id}-${item.status}`"
                class="action-btn"
                @tap="toggleFeedbackStatus(item)"
              >
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
.chart-title,
.rank-name {
  font-size: 30rpx;
  font-weight: 700;
  color: #111111;
}

.hero-desc,
.summary-label,
.monitor-label,
.chart-note,
.feedback-product,
.feedback-summary,
.feedback-time,
.rank-desc,
.legend-item {
  font-size: 24rpx;
  line-height: 1.6;
  color: #6e7380;
}

.summary-row,
.filter-row,
.feedback-list,
.legend-row,
.rank-main {
  display: flex;
}

.summary-row,
.filter-row {
  gap: 16rpx;
  flex-wrap: wrap;
}

.dashboard-toolbar {
  padding: 10rpx 4rpx 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.toolbar-title {
  font-size: 24rpx;
  font-weight: 700;
  color: #17181c;
}

.range-switch {
  padding: 8rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  border-radius: 999rpx;
  background: #ffffff;
}

.range-pill {
  padding: 12rpx 22rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: #6e7380;
}

.range-pill.active {
  background: #17181c;
  color: #ffffff;
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

.chart-stack,
.chart-block,
.feedback-list,
.feedback-copy {
  display: flex;
  flex-direction: column;
}

.chart-stack,
.feedback-list {
  gap: 16rpx;
  margin-top: 18rpx;
}

.feedback-copy {
  gap: 6rpx;
}

.chart-block {
  gap: 16rpx;
  padding: 24rpx;
  margin-top: 18rpx;
  border-radius: 32rpx;
  background: #f7f7fa;
}

.chart-head,
.rank-row-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.chart-scroll {
  width: 100%;
  white-space: nowrap;
}

.legend-row {
  gap: 18rpx;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.legend-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
}

.legend-dot.pending {
  background: #db6a3d;
}

.legend-dot.resolved {
  background: #29875c;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14rpx;
  min-height: 260rpx;
}

.chart-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.chart-value {
  font-size: 20rpx;
  font-weight: 700;
  color: #111111;
}

.chart-track {
  width: 100%;
  height: 180rpx;
  padding: 0 10rpx;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.chart-bar {
  width: 100%;
  border-radius: 20rpx 20rpx 0 0;
  transition: height 0.2s ease;
}

.chart-bar.dark {
  background: linear-gradient(180deg, #17181c 0%, rgba(23, 24, 28, 0.75) 100%);
}

.chart-bar.warm {
  background: linear-gradient(180deg, #db6a3d 0%, rgba(219, 106, 61, 0.76) 100%);
}

.bar-chart.grouped {
  gap: 10rpx;
}

.grouped-column .chart-track {
  padding: 0 4rpx;
}

.grouped-track {
  align-items: flex-end;
}

.chart-group {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 8rpx;
}

.chart-group .chart-bar {
  width: calc(50% - 4rpx);
}

.chart-bar.pending {
  background: linear-gradient(180deg, #db6a3d 0%, rgba(219, 106, 61, 0.72) 100%);
}

.chart-bar.resolved {
  background: linear-gradient(180deg, #29875c 0%, rgba(41, 135, 92, 0.72) 100%);
}

.chart-label {
  font-size: 20rpx;
  color: #8c93a1;
}

.rank-chart {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  margin-top: 18rpx;
}

.rank-chart.compact {
  margin-top: 0;
}

.rank-grid {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 18rpx;
}

.rank-panel {
  margin-top: 0;
}

.rank-row {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.rank-main {
  align-items: center;
  gap: 12rpx;
  flex: 1;
}

.rank-index {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #17181c;
  color: #ffffff;
  font-size: 20rpx;
  font-weight: 700;
  flex-shrink: 0;
}

.rank-number {
  font-size: 22rpx;
  font-weight: 700;
  color: #111111;
}

.rank-track {
  width: 100%;
  height: 18rpx;
  border-radius: 999rpx;
  background: #edf0f5;
  overflow: hidden;
}

.rank-fill {
  height: 100%;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #17181c 0%, #db6a3d 100%);
}

.rank-fill.category {
  background: linear-gradient(90deg, #17181c 0%, #db6a3d 100%);
}

.rank-fill.reason {
  background: linear-gradient(90deg, #29875c 0%, #6dbd8c 100%);
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
