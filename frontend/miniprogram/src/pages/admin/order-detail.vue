<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import {
  getAdminAfterSales,
  getAdminOrderDetail,
  updateAdminAfterSale,
  updateAdminOrder,
  updateAdminOrderLogistics,
  type AdminAfterSaleRecord,
  type AdminOrderRecord
} from '../../services/adminService';
import { useUserStore } from '../../store';
import { ensureAdminPageAccess } from '../../utils/admin';

const userStore = useUserStore();
const orderId = ref('');
const loading = ref(false);
const order = ref<AdminOrderRecord | null>(null);
const relatedAfterSales = ref<AdminAfterSaleRecord[]>([]);
const routeKey = ref('');
const logisticsForm = reactive({
  carrier: '',
  trackingNo: ''
});

interface OrderDetailQuery {
  id: string;
}

const summaryCards = computed(() => {
  if (!order.value) {
    return [];
  }

  return [
    { label: '订单金额', value: `¥${order.value.amount}` },
    { label: '商品数量', value: `${order.value.items.length}` },
    { label: '关联售后', value: `${relatedAfterSales.value.length}` },
    { label: '物流单号', value: order.value.logistics?.trackingNo || '未录入' }
  ];
});

const timelineItems = computed(() => {
  return (order.value?.timeline || []).slice().reverse();
});

const orderStatusLabel = computed(() => formatOrderStatus(order.value?.status || ''));
const nextOrderActionText = computed(() => getNextOrderActionText(order.value?.status || ''));

function formatOrderStatus(status: string) {
  return (
    {
      pending_payment: '待支付',
      pending_shipping: '待发货',
      shipped: '已发货',
      completed: '已完成',
      cancelled: '已取消'
    }[status] || status
  );
}

function formatAfterSaleStatus(status: AdminAfterSaleRecord['status']) {
  return (
    {
      submitted: '已提交',
      reviewing: '审核中',
      approved: '已通过',
      rejected: '已驳回'
    }[status] || status
  );
}

function getNextOrderStatus(status = '') {
  return (
    {
      pending_payment: 'pending_shipping',
      pending_shipping: 'shipped',
      shipped: 'completed'
    }[status] || ''
  );
}

function getNextOrderActionText(status = '') {
  return (
    {
      pending_payment: '记为已支付',
      pending_shipping: '标记发货',
      shipped: '完成订单'
    }[status] || ''
  );
}

function normalizeQuery(query?: Record<string, any>): OrderDetailQuery {
  return {
    id: typeof query?.id === 'string' ? query.id : ''
  };
}

function buildRouteKey(query: OrderDetailQuery) {
  return query.id;
}

function resetPageState() {
  order.value = null;
  relatedAfterSales.value = [];
  logisticsForm.carrier = '';
  logisticsForm.trackingNo = '';
}

function applyAfterSale(updated: AdminAfterSaleRecord) {
  relatedAfterSales.value = relatedAfterSales.value.map((item) => (item.id === updated.id ? { ...updated } : item));
}

function applyOrderDetail(payload: AdminOrderRecord) {
  order.value = {
    ...payload,
    logistics: payload.logistics ? { ...payload.logistics } : null,
    timeline: (payload.timeline || []).map((item) => ({ ...item })),
    items: payload.items.map((item) => ({
      ...item,
      product: item.product ? { ...item.product } : undefined
    }))
  };

  syncLogisticsForm();
}

function syncLogisticsForm() {
  logisticsForm.carrier = order.value?.logistics?.carrier || '';
  logisticsForm.trackingNo = order.value?.logistics?.trackingNo || '';
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

async function loadDetail() {
  if (!orderId.value || !ensureAdminPageAccess(userStore.isAdmin)) {
    return;
  }

  loading.value = true;

  try {
    const [orderPayload, afterSalePayload] = await Promise.all([
      getAdminOrderDetail(orderId.value),
      getAdminAfterSales(orderId.value)
    ]);

    applyOrderDetail(orderPayload);
    relatedAfterSales.value = afterSalePayload.map((item) => ({ ...item }));
  } catch (error) {
    const message = error instanceof Error ? error.message : '订单详情加载失败';
    uni.showToast({
      title: message,
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
}

async function promoteOrder() {
  if (!order.value) {
    return;
  }

  const nextStatus = getNextOrderStatus(order.value.status);

  if (!nextStatus) {
    uni.showToast({
      title: '当前状态无需推进',
      icon: 'none'
    });
    return;
  }

  if (nextStatus === 'shipped' && !order.value.logistics?.trackingNo) {
    uni.showToast({
      title: '请先录入物流单号',
      icon: 'none'
    });
    return;
  }

  try {
    const updated = await updateAdminOrder(order.value.id, {
      status: nextStatus
    });
    applyOrderDetail(updated);

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

async function saveLogistics() {
  if (!order.value) {
    return;
  }

  if (!logisticsForm.carrier.trim() || !logisticsForm.trackingNo.trim()) {
    uni.showToast({
      title: '请填写完整物流信息',
      icon: 'none'
    });
    return;
  }

  try {
    const updated = await updateAdminOrderLogistics(order.value.id, {
      carrier: logisticsForm.carrier.trim(),
      trackingNo: logisticsForm.trackingNo.trim()
    });
    applyOrderDetail(updated);
    uni.showToast({
      title: '物流信息已保存',
      icon: 'success'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '物流信息保存失败';
    uni.showToast({
      title: message,
      icon: 'none'
    });
  }
}

async function handleAfterSale(id: string, status: AdminAfterSaleRecord['status']) {
  try {
    const updated = await updateAdminAfterSale(id, {
      status
    });

    applyAfterSale(updated);
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

function openAfterSalesPage() {
  uni.navigateTo({
    url: `/pages/admin/after-sales?orderId=${encodeURIComponent(orderId.value)}`
  });
}

function goOrders() {
  uni.redirectTo({
    url: '/pages/admin/orders'
  });
}

async function initializePage(rawQuery?: Record<string, any>) {
  const nextQuery = normalizeQuery(rawQuery);
  const nextRouteKey = buildRouteKey(nextQuery);

  if (!nextQuery.id) {
    return;
  }

  if (routeKey.value !== nextRouteKey) {
    resetPageState();
    routeKey.value = nextRouteKey;
  }

  orderId.value = nextQuery.id;
  await loadDetail();
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
    <AppHeader title="订单详情" back />

    <scroll-view scroll-y class="page-scroll">
      <view v-if="order" class="body">
        <view class="hero-card">
          <view class="hero-head">
            <view class="hero-copy">
              <text class="hero-title">订单 {{ order.id }}</text>
              <text class="hero-desc">创建于 {{ order.createdAt }}，可在这里推进状态并审核该订单关联的售后记录。</text>
            </view>
            <text :key="`status-${order.id}-${order.status}`" class="status-pill">{{ orderStatusLabel }}</text>
          </view>
          <view class="hero-actions">
            <view
              v-if="nextOrderActionText"
              :key="`primary-${order.id}-${order.status}`"
              class="primary-btn"
              @tap="promoteOrder"
            >
              <text>{{ nextOrderActionText }}</text>
            </view>
            <view class="ghost-btn" @tap="openAfterSalesPage">
              <text>售后审批页</text>
            </view>
          </view>
        </view>

        <view class="summary-row">
          <view v-for="item in summaryCards" :key="item.label" class="summary-card">
            <text class="summary-label">{{ item.label }}</text>
            <text class="summary-value">{{ item.value }}</text>
          </view>
        </view>

        <view class="section-card">
          <text class="section-title">商品明细</text>
          <view class="goods-list">
            <view v-for="item in order.items" :key="item.id" class="goods-item">
              <image class="goods-cover" :src="item.product?.cover" mode="aspectFill" />
              <view class="goods-copy">
                <text class="goods-title">{{ item.product?.title }}</text>
                <text class="goods-meta">规格 {{ item.size }} · 数量 x{{ item.quantity }}</text>
                <text class="goods-meta">单价 ¥{{ item.product?.price || 0 }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="section-card">
          <text class="section-title">物流信息</text>
          <view class="logistics-card">
            <view v-if="order.logistics" class="logistics-meta">
              <text class="logistics-copy">最近更新：{{ order.logistics.updatedAt }}</text>
            </view>
            <input v-model="logisticsForm.carrier" class="field" placeholder="承运商，如：顺丰速运" />
            <input v-model="logisticsForm.trackingNo" class="field" placeholder="物流单号" />
            <view class="primary-btn" @tap="saveLogistics">
              <text>保存物流信息</text>
            </view>
          </view>
        </view>

        <view class="section-card">
          <text class="section-title">订单时间线</text>
          <view v-if="timelineItems.length" class="timeline-list">
            <view v-for="item in timelineItems" :key="item.id" class="timeline-item">
              <view class="timeline-dot" />
              <view class="timeline-copy">
                <text class="timeline-title">{{ item.title }}</text>
                <text class="timeline-time">{{ item.time }}</text>
                <text class="timeline-desc">{{ item.desc }}</text>
              </view>
            </view>
          </view>
          <EmptyStateCard
            v-else
            title="暂无时间线记录"
            desc="后续的支付确认、物流录入与发货完成会按时间顺序沉淀到这里。"
          />
        </view>

        <view class="section-card">
          <text class="section-title">关联售后</text>
          <view v-if="relatedAfterSales.length" class="after-sale-list">
            <view v-for="item in relatedAfterSales" :key="`after-sale-${item.id}-${item.status}`" class="after-sale-card">
              <view class="after-sale-head">
                <view class="after-sale-copy">
                  <text class="after-sale-title">{{ item.productTitle }}</text>
                  <text class="after-sale-meta">{{ item.userName }} · {{ item.createdAt }}</text>
                </view>
                <text
                  :key="`after-sale-status-${item.id}-${item.status}`"
                  :class="['after-sale-status', item.status]"
                >
                  {{ formatAfterSaleStatus(item.status) }}
                </text>
              </view>
              <text class="after-sale-reason">{{ item.reason }}</text>
              <view
                v-if="item.status === 'submitted' || item.status === 'reviewing'"
                :key="`after-sale-actions-${item.id}-${item.status}`"
                class="after-sale-actions"
              >
                <view class="ghost-btn" @tap="handleAfterSale(item.id, 'rejected')">
                  <text>驳回</text>
                </view>
                <view class="primary-btn" @tap="handleAfterSale(item.id, 'approved')">
                  <text>通过</text>
                </view>
              </view>
            </view>
          </view>
          <EmptyStateCard
            v-else
            title="暂无关联售后"
            desc="当前订单暂时没有售后申请记录。"
            action-text="查看全部售后"
            @action="openAfterSalesPage"
          />
        </view>
      </view>

      <view v-else class="empty-wrap">
        <EmptyStateCard
          :title="loading ? '订单详情加载中' : '未找到订单'"
          :desc="loading ? '正在准备订单详情，请稍候。' : '可以返回订单处理页重新选择订单。'"
          action-text="返回订单处理"
          @action="goOrders"
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
  gap: 20rpx;
}

.hero-card,
.summary-card,
.section-card {
  background: #ffffff;
}

.hero-card,
.section-card {
  padding: 28rpx;
  border-radius: 40rpx;
}

.hero-head,
.hero-copy,
.summary-row,
.hero-actions,
.goods-list,
.goods-copy,
.logistics-card,
.after-sale-list,
.after-sale-copy,
.after-sale-actions,
.timeline-list,
.timeline-copy {
  display: flex;
}

.hero-head {
  align-items: flex-start;
  justify-content: space-between;
  gap: 18rpx;
}

.hero-copy,
.goods-copy,
.after-sale-copy,
.logistics-card,
.timeline-copy {
  flex-direction: column;
  gap: 8rpx;
}

.hero-copy {
  flex: 1;
}

.hero-title,
.section-title,
.goods-title,
.after-sale-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #111111;
}

.hero-desc,
.summary-label,
.goods-meta,
.logistics-copy,
.after-sale-meta,
.after-sale-reason,
.timeline-time,
.timeline-desc {
  font-size: 24rpx;
  line-height: 1.6;
  color: #6e7380;
}

.status-pill,
.after-sale-status {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  font-weight: 700;
  flex-shrink: 0;
}

.status-pill {
  background: #f3f4f8;
  color: #111111;
}

.hero-actions {
  gap: 12rpx;
  margin-top: 18rpx;
  flex-wrap: wrap;
}

.summary-row {
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

.goods-list,
.after-sale-list,
.timeline-list {
  flex-direction: column;
  gap: 16rpx;
  margin-top: 18rpx;
}

.goods-item,
.after-sale-card {
  display: flex;
  gap: 18rpx;
  padding: 22rpx;
  border-radius: 28rpx;
  background: #f7f7fa;
}

.goods-cover {
  width: 132rpx;
  height: 132rpx;
  border-radius: 24rpx;
  background: #eef0f4;
  flex-shrink: 0;
}

.goods-copy {
  flex: 1;
}

.after-sale-card {
  flex-direction: column;
}

.logistics-card {
  margin-top: 18rpx;
}

.field {
  width: 100%;
  height: 92rpx;
  padding: 0 24rpx;
  border-radius: 24rpx;
  background: #f7f7fa;
  font-size: 24rpx;
}

.timeline-item {
  display: flex;
  gap: 16rpx;
  padding: 20rpx 0;
  border-bottom: 1px solid #f0f1f4;
}

.timeline-item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.timeline-dot {
  width: 20rpx;
  height: 20rpx;
  margin-top: 10rpx;
  border-radius: 50%;
  background: #17181c;
  flex-shrink: 0;
}

.timeline-copy {
  flex: 1;
}

.timeline-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #111111;
}

.after-sale-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.after-sale-status.submitted,
.after-sale-status.reviewing {
  background: rgba(219, 106, 61, 0.12);
  color: #db6a3d;
}

.after-sale-status.approved {
  background: rgba(41, 135, 92, 0.12);
  color: #29875c;
}

.after-sale-status.rejected {
  background: rgba(225, 91, 77, 0.12);
  color: #e15b4d;
}

.after-sale-actions {
  gap: 12rpx;
  justify-content: flex-end;
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
