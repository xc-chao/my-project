<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AppHeader from '../../components/AppHeader.vue';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import OrderCard from '../../components/common/OrderCard.vue';
import { getAdminOrders, updateAdminOrder, type AdminOrderRecord } from '../../services/adminService';
import { useUserStore } from '../../store';
import { ensureAdminPageAccess } from '../../utils/admin';

type OrderFilter = 'all' | 'pending' | 'shipping' | 'done';

const userStore = useUserStore();
const loading = ref(false);
const orders = ref<AdminOrderRecord[]>([]);
const currentFilter = ref<OrderFilter>('all');
const filters: Array<{ key: OrderFilter; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待处理' },
  { key: 'shipping', label: '配送中' },
  { key: 'done', label: '已完成' }
];

const summaryCards = computed(() => {
  const pendingCount = orders.value.filter((item) => ['pending_payment', 'pending_shipping'].includes(item.status)).length;
  const shippingCount = orders.value.filter((item) => item.status === 'shipped').length;
  const doneCount = orders.value.filter((item) => ['completed', 'cancelled'].includes(item.status)).length;

  return [
    { label: '订单总数', value: `${orders.value.length}` },
    { label: '待处理', value: `${pendingCount}` },
    { label: '配送中', value: `${shippingCount}` },
    { label: '已完成', value: `${doneCount}` }
  ];
});

const filteredOrders = computed(() => {
  if (currentFilter.value === 'all') {
    return orders.value;
  }

  if (currentFilter.value === 'pending') {
    return orders.value.filter((item) => ['pending_payment', 'pending_shipping'].includes(item.status));
  }

  if (currentFilter.value === 'shipping') {
    return orders.value.filter((item) => item.status === 'shipped');
  }

  return orders.value.filter((item) => ['completed', 'cancelled'].includes(item.status));
});

async function loadOrders() {
  if (!ensureAdminPageAccess(userStore.isAdmin)) {
    return;
  }

  loading.value = true;

  try {
    orders.value = await getAdminOrders();
  } catch (error) {
    const message = error instanceof Error ? error.message : '订单数据加载失败';
    uni.showToast({
      title: message,
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
}

function getNextStatus(status: string) {
  return (
    {
      pending_payment: 'pending_shipping',
      pending_shipping: 'shipped',
      shipped: 'completed'
    }[status] || ''
  );
}

function getActionText(status: string) {
  return (
    {
      pending_payment: '记为已支付',
      pending_shipping: '标记发货',
      shipped: '完成订单'
    }[status] || ''
  );
}

function applyOrder(updated: AdminOrderRecord) {
  const index = orders.value.findIndex((item) => item.id === updated.id);

  if (index > -1) {
    orders.value[index] = updated;
  }
}

async function promoteOrder(id: string) {
  const target = orders.value.find((item) => item.id === id);
  const nextStatus = getNextStatus(target?.status || '');

  if (!target || !nextStatus) {
    uni.showToast({
      title: '当前状态无需推进',
      icon: 'none'
    });
    return;
  }

  try {
    const updated = await updateAdminOrder(id, {
      status: nextStatus
    });

    applyOrder(updated);
    uni.showToast({
      title: '订单状态已推进',
      icon: 'none'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '订单状态更新失败';
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

onMounted(loadOrders);
</script>

<template>
  <view class="page-shell">
    <AppHeader title="订单处理" back />

    <scroll-view scroll-y class="page-scroll">
      <view class="body">
        <view class="hero-card">
          <text class="hero-title">订单处理</text>
          <text class="hero-desc">管理员在这里查看支付确认、发货推进、签收完成与异常订单状态流转。</text>
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

        <view v-if="filteredOrders.length" class="list">
          <OrderCard
            v-for="item in filteredOrders"
            :key="item.id"
            :item="item"
            :action-text="getActionText(item.status)"
            @action="promoteOrder"
          />
        </view>

        <EmptyStateCard
          v-else
          :title="loading ? '订单加载中' : '当前筛选下暂无订单'"
          :desc="loading ? '正在准备订单管理列表，请稍候。' : '可以切换筛选查看其他处理状态。'"
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
.summary-card {
  background: #ffffff;
}

.hero-card {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding: 28rpx;
  border-radius: 40rpx;
}

.hero-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #111111;
}

.hero-desc,
.summary-label {
  font-size: 24rpx;
  line-height: 1.6;
  color: #6e7380;
}

.summary-row,
.filter-row,
.list {
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
  gap: 18rpx;
}
</style>
