<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import OrderCard from '../../components/common/OrderCard.vue';
import { pageImageMap } from '../../constants/page-image-map';
import { getOrderList } from '../../services/orderService';

const highlightId = ref('');
const statusTab = ref<'all' | 'pending' | 'done'>('all');
const orders = ref<Array<any>>([]);
const tabs: Array<{ key: 'all' | 'pending' | 'done'; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '进行中' },
  { key: 'done', label: '已完成' }
];

const filteredOrders = computed(() => {
  if (statusTab.value === 'all') {
    return orders.value;
  }

  if (statusTab.value === 'pending') {
    return orders.value.filter((item) => ['pending_payment', 'pending_shipping', 'shipped'].includes(item.status));
  }

  return orders.value.filter((item) => ['completed', 'cancelled'].includes(item.status));
});

async function loadOrders() {
  orders.value = await getOrderList();
}

function goAfterSale(orderId: string) {
  const order = orders.value.find((item) => item.id === orderId);
  const first = order?.items?.[0];

  uni.navigateTo({
    url: `/pages/after-sale/index?orderId=${orderId}&productTitle=${encodeURIComponent(first?.product?.title || '订单商品')}`
  });
}

function goHome() {
  uni.switchTab({
    url: '/pages/home/index'
  });
}

onLoad((query) => {
  if (typeof query?.highlight === 'string') {
    highlightId.value = query.highlight;
  }
});

onMounted(loadOrders);
</script>

<template>
  <view class="page-shell">
    <AppHeader title="历史订单" back />

    <view class="body">
      <view class="hero-strip">
        <view class="hero-copy">
          <text class="hero-title">订单与物流</text>
          <text class="hero-desc">统一查看支付、发货、签收与售后入口，流程更连贯。</text>
        </view>
      </view>

      <view class="tabs">
        <view
          v-for="item in tabs"
          :key="item.key"
          :class="['tab-pill', { active: statusTab === item.key }]"
          @tap="statusTab = item.key"
        >
          <text>{{ item.label }}</text>
        </view>
      </view>

      <scroll-view scroll-y class="list-scroll">
        <view v-if="filteredOrders.length" class="list">
          <view
            v-for="item in filteredOrders"
            :key="item.id"
            :class="['order-wrap', { highlight: item.id === highlightId }]"
          >
            <OrderCard
              :item="item"
              action-text="申请售后"
              @action="goAfterSale"
            />
          </view>
        </view>

        <EmptyStateCard
          v-else
          title="还没有订单记录"
          desc="可以先去首页浏览商品，完成加购和下单后再回来查看。"
          action-text="去首页"
          @action="goHome"
        />
      </scroll-view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.body {
  padding: 8rpx 40rpx 40rpx;
}

.hero-strip {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  padding: 24rpx;
  border-radius: 40rpx;
  background: #ffffff;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.hero-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #111111;
}

.hero-desc {
  font-size: 24rpx;
  line-height: 1.6;
  color: #6e7380;
}

.hero-images {
  display: flex;
  gap: 16rpx;
  height: 220rpx;
}

.hero-main,
.hero-accent {
  border-radius: 28rpx;
  background: #eef0f4;
}

.hero-main {
  flex: 1;
}

.hero-accent {
  width: 180rpx;
}

.tabs,
.tab-pill {
  display: flex;
  align-items: center;
}

.tabs {
  gap: 16rpx;
  margin-top: 20rpx;
}

.tab-pill {
  padding: 18rpx 28rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #6e7380;
  font-size: 24rpx;
  font-weight: 600;
}

.tab-pill.active {
  background: #17181c;
  color: #ffffff;
}

.list-scroll {
  height: calc(100vh - 260rpx);
  margin-top: 22rpx;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding-bottom: 40rpx;
}

.order-wrap {
  border-radius: 44rpx;
}

.order-wrap.highlight {
  box-shadow: 0 0 0 4rpx rgba(23, 24, 28, 0.08);
}
</style>
