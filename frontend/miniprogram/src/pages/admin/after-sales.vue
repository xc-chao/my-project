<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import {
  getAdminAfterSales,
  updateAdminAfterSale,
  type AdminAfterSaleRecord
} from '../../services/adminService';
import { useUserStore } from '../../store';
import { ensureAdminPageAccess } from '../../utils/admin';

type FilterKey = 'all' | 'pending' | 'approved' | 'rejected';

const userStore = useUserStore();
const loading = ref(false);
const focusOrderId = ref('');
const records = ref<AdminAfterSaleRecord[]>([]);
const currentFilter = ref<FilterKey>('all');
const routeKey = ref('');
const filters: Array<{ key: FilterKey; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待审核' },
  { key: 'approved', label: '已通过' },
  { key: 'rejected', label: '已驳回' }
];

const filteredRecords = computed(() => {
  if (currentFilter.value === 'all') {
    return records.value;
  }

  if (currentFilter.value === 'pending') {
    return records.value.filter((item) => item.status === 'submitted' || item.status === 'reviewing');
  }

  return records.value.filter((item) => item.status === currentFilter.value);
});

const summaryCards = computed(() => {
  const pendingCount = records.value.filter((item) => item.status === 'submitted' || item.status === 'reviewing').length;
  const approvedCount = records.value.filter((item) => item.status === 'approved').length;
  const rejectedCount = records.value.filter((item) => item.status === 'rejected').length;

  return [
    { label: '售后总数', value: `${records.value.length}` },
    { label: '待审核', value: `${pendingCount}` },
    { label: '已通过', value: `${approvedCount}` },
    { label: '已驳回', value: `${rejectedCount}` }
  ];
});

interface AfterSalesQuery {
  orderId: string;
}

function formatStatus(status: AdminAfterSaleRecord['status']) {
  return (
    {
      submitted: '已提交',
      reviewing: '审核中',
      approved: '已通过',
      rejected: '已驳回'
    }[status] || status
  );
}

function cloneRecord(record: AdminAfterSaleRecord): AdminAfterSaleRecord {
  return {
    ...record
  };
}

function normalizeQuery(query?: Record<string, any>): AfterSalesQuery {
  return {
    orderId: typeof query?.orderId === 'string' ? query.orderId : ''
  };
}

function buildRouteKey(query: AfterSalesQuery) {
  return query.orderId;
}

function resetPageState() {
  focusOrderId.value = '';
  currentFilter.value = 'all';
  records.value = [];
}

function getCurrentPageQuery() {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as { options?: Record<string, any> } | undefined;
  return currentPage?.options || {};
}

function getH5Query() {
  if (typeof window === 'undefined') {
    return getCurrentPageQuery();
  }

  const hash = window.location.hash || '';
  const [, search = ''] = hash.split('?');
  return Object.fromEntries(new URLSearchParams(search).entries());
}

function applyRecord(updated: AdminAfterSaleRecord) {
  records.value = records.value.map((item) => (item.id === updated.id ? cloneRecord(updated) : item));
}

async function loadRecords() {
  if (!ensureAdminPageAccess(userStore.isAdmin)) {
    return;
  }

  loading.value = true;

  try {
    const list = await getAdminAfterSales(focusOrderId.value || undefined);
    records.value = list.map(cloneRecord);
  } catch (error) {
    const message = error instanceof Error ? error.message : '售后数据加载失败';
    uni.showToast({
      title: message,
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
}

async function updateStatus(item: AdminAfterSaleRecord, status: AdminAfterSaleRecord['status']) {
  try {
    const updated = await updateAdminAfterSale(item.id, {
      status
    });

    applyRecord(updated);
    uni.showToast({
      title: status === 'approved' ? '已通过售后' : '已驳回售后',
      icon: 'none'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '售后状态更新失败';
    uni.showToast({
      title: message,
      icon: 'none'
    });
  }
}

function openOrder(id: string) {
  uni.navigateTo({
    url: `/pages/admin/order-detail?id=${id}`
  });
}

function goAdminHome() {
  uni.redirectTo({
    url: '/pages/admin/orders'
  });
}

async function initializePage(rawQuery?: Record<string, any>) {
  const nextQuery = normalizeQuery(rawQuery);
  const nextRouteKey = buildRouteKey(nextQuery);

  if (routeKey.value !== nextRouteKey) {
    resetPageState();
    routeKey.value = nextRouteKey;
  }

  focusOrderId.value = nextQuery.orderId;
  await loadRecords();
}

function handleH5RouteChange() {
  void initializePage(getH5Query());
}

onLoad((query) => {
  void initializePage(query as Record<string, any>);
});

onShow(() => {
  const query = typeof window === 'undefined' ? getCurrentPageQuery() : getH5Query();
  void initializePage(query);
});

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('hashchange', handleH5RouteChange);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('hashchange', handleH5RouteChange);
  }
});
</script>

<template>
  <view class="page-shell">
    <AppHeader title="售后审批" back />

    <scroll-view scroll-y class="page-scroll">
      <view class="body">
        <view class="hero-card">
          <text class="hero-title">售后审批</text>
          <text class="hero-desc">
            {{ focusOrderId ? `当前聚焦订单 ${focusOrderId} 的售后记录，可直接审核通过或驳回。` : '集中查看全部售后申请，并统一推进审核结果。' }}
          </text>
        </view>

        <view class="summary-row">
          <view v-for="item in summaryCards" :key="item.label" class="summary-card">
            <text class="summary-label">{{ item.label }}</text>
            <text class="summary-value">{{ item.value }}</text>
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

        <view v-if="filteredRecords.length" class="list">
          <view v-for="item in filteredRecords" :key="`after-sale-${item.id}-${item.status}`" class="record-card">
            <view class="record-head">
              <view class="record-copy">
                <text class="record-title">{{ item.productTitle }}</text>
                <text class="record-meta">{{ item.userName }} · 订单 {{ item.orderId }}</text>
                <text class="record-meta">{{ item.createdAt }}</text>
              </view>
              <text :key="`after-sale-status-${item.id}-${item.status}`" :class="['status-pill', item.status]">
                {{ formatStatus(item.status) }}
              </text>
            </view>
            <text class="record-reason">{{ item.reason }}</text>
            <view :key="`after-sale-actions-${item.id}-${item.status}`" class="action-row">
              <view class="ghost-btn" @tap="openOrder(item.orderId)">
                <text>查看订单</text>
              </view>
              <template v-if="item.status === 'submitted' || item.status === 'reviewing'">
                <view class="ghost-btn" @tap="updateStatus(item, 'rejected')">
                  <text>驳回</text>
                </view>
                <view class="primary-btn" @tap="updateStatus(item, 'approved')">
                  <text>通过</text>
                </view>
              </template>
            </view>
          </view>
        </view>

        <EmptyStateCard
          v-else
          :title="loading ? '售后记录加载中' : '暂无售后记录'"
          :desc="loading ? '正在准备售后审批数据，请稍候。' : '当前筛选下没有可处理的售后记录。'"
          action-text="返回订单处理"
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
.record-card {
  background: #ffffff;
}

.hero-card {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding: 28rpx;
  border-radius: 40rpx;
}

.hero-title,
.record-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #111111;
}

.hero-desc,
.summary-label,
.record-meta,
.record-reason {
  font-size: 24rpx;
  line-height: 1.6;
  color: #6e7380;
}

.summary-row,
.filter-row,
.list,
.record-copy,
.action-row {
  display: flex;
}

.summary-row,
.filter-row {
  gap: 16rpx;
  flex-wrap: wrap;
}

.summary-card {
  flex: 1;
  min-width: calc(50% - 8rpx);
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 24rpx;
  border-radius: 28rpx;
}

.summary-value {
  font-size: 38rpx;
  font-weight: 700;
  color: #111111;
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

.list {
  flex-direction: column;
  gap: 16rpx;
}

.record-card {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  padding: 24rpx;
  border-radius: 32rpx;
}

.record-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.record-copy {
  flex: 1;
  flex-direction: column;
  gap: 6rpx;
}

.status-pill {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  font-weight: 700;
}

.status-pill.submitted,
.status-pill.reviewing {
  background: rgba(219, 106, 61, 0.12);
  color: #db6a3d;
}

.status-pill.approved {
  background: rgba(41, 135, 92, 0.12);
  color: #29875c;
}

.status-pill.rejected {
  background: rgba(225, 91, 77, 0.12);
  color: #e15b4d;
}

.action-row {
  gap: 12rpx;
  flex-wrap: wrap;
}

.ghost-btn,
.primary-btn {
  min-width: 148rpx;
  height: 72rpx;
  padding: 0 24rpx;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  font-weight: 700;
}

.ghost-btn {
  background: #f3f4f8;
  color: #111111;
}

.primary-btn {
  background: #17181c;
  color: #ffffff;
}
</style>
