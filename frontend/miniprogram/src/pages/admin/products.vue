<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AppHeader from '../../components/AppHeader.vue';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import { getAdminProducts, updateAdminProduct } from '../../services/adminService';
import { useUserStore } from '../../store';
import type { ProductItem } from '../../mock/data';
import { ensureAdminPageAccess } from '../../utils/admin';

type ProductFilter = 'all' | 'on_sale' | 'low_stock' | 'off_shelf';

const userStore = useUserStore();
const loading = ref(false);
const products = ref<ProductItem[]>([]);
const currentFilter = ref<ProductFilter>('all');
const filters: Array<{ key: ProductFilter; label: string }> = [
  { key: 'all', label: '全部商品' },
  { key: 'on_sale', label: '在售' },
  { key: 'low_stock', label: '低库存' },
  { key: 'off_shelf', label: '已下架' }
];

const summaryCards = computed(() => {
  const onSaleCount = products.value.filter((item) => getSaleStatus(item) === 'on_sale').length;
  const lowStockCount = products.value.filter((item) => item.stock <= 20).length;

  return [
    { label: '商品总数', value: `${products.value.length}` },
    { label: '在售商品', value: `${onSaleCount}` },
    { label: '低库存', value: `${lowStockCount}` }
  ];
});

const filteredProducts = computed(() => {
  if (currentFilter.value === 'all') {
    return products.value;
  }

  if (currentFilter.value === 'low_stock') {
    return products.value.filter((item) => item.stock <= 20);
  }

  return products.value.filter((item) => getSaleStatus(item) === currentFilter.value);
});

function getSaleStatus(item: ProductItem) {
  return item.saleStatus || 'on_sale';
}

function getSaleStatusLabel(item: ProductItem) {
  return getSaleStatus(item) === 'on_sale' ? '在售中' : '已下架';
}

function applyProduct(updated: ProductItem) {
  const index = products.value.findIndex((item) => item.id === updated.id);

  if (index > -1) {
    products.value[index] = updated;
  }
}

async function loadProducts() {
  if (!ensureAdminPageAccess(userStore.isAdmin)) {
    return;
  }

  loading.value = true;

  try {
    products.value = await getAdminProducts();
  } catch (error) {
    const message = error instanceof Error ? error.message : '商品数据加载失败';
    uni.showToast({
      title: message,
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
}

async function toggleProductStatus(item: ProductItem) {
  const nextStatus = getSaleStatus(item) === 'on_sale' ? 'off_shelf' : 'on_sale';

  try {
    const updated = await updateAdminProduct(item.id, {
      saleStatus: nextStatus
    });

    applyProduct(updated);
    uni.showToast({
      title: nextStatus === 'on_sale' ? '已上架' : '已下架',
      icon: 'none'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '商品状态更新失败';
    uni.showToast({
      title: message,
      icon: 'none'
    });
  }
}

async function replenishStock(item: ProductItem) {
  try {
    const updated = await updateAdminProduct(item.id, {
      stock: item.stock + 10
    });

    applyProduct(updated);
    uni.showToast({
      title: '库存 +10',
      icon: 'none'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '库存更新失败';
    uni.showToast({
      title: message,
      icon: 'none'
    });
  }
}

function openDetail(id: string) {
  uni.navigateTo({
    url: `/pages/product/detail?id=${id}`
  });
}

function goAdminHome() {
  uni.redirectTo({
    url: '/pages/admin/index'
  });
}

onMounted(loadProducts);
</script>

<template>
  <view class="page-shell">
    <AppHeader title="商品管理" back />

    <scroll-view scroll-y class="page-scroll">
      <view class="body">
        <view class="hero-card">
          <text class="hero-title">商品管理</text>
          <text class="hero-desc">查看在售与下架商品，处理低库存，并快速跳转到前台详情页核对展示效果。</text>
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

        <view v-if="filteredProducts.length" class="list">
          <view v-for="item in filteredProducts" :key="item.id" class="product-card">
            <image class="product-cover" :src="item.cover" mode="aspectFill" />
            <view class="product-main">
              <view class="product-top">
                <view class="product-copy">
                  <text class="product-title">{{ item.title }}</text>
                  <text class="product-desc">{{ item.subtitle }}</text>
                </view>
                <text :class="['status-pill', { off: getSaleStatus(item) === 'off_shelf' }]">
                  {{ getSaleStatusLabel(item) }}
                </text>
              </view>

              <view class="meta-row">
                <text class="meta-pill">{{ item.category }}</text>
                <text :class="['meta-pill', { warn: item.stock <= 20 }]">库存 {{ item.stock }}</text>
                <text class="meta-pill">销量 {{ item.sales }}</text>
              </view>

              <view class="price-row">
                <text class="price">¥{{ item.price }}</text>
                <text class="origin">¥{{ item.originalPrice }}</text>
              </view>

              <view class="action-row">
                <view class="ghost-btn" @tap="replenishStock(item)">
                  <text>补库存</text>
                </view>
                <view class="ghost-btn" @tap="openDetail(item.id)">
                  <text>查看详情</text>
                </view>
                <view class="primary-btn" @tap="toggleProductStatus(item)">
                  <text>{{ getSaleStatus(item) === 'on_sale' ? '下架' : '上架' }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <EmptyStateCard
          v-else
          :title="loading ? '商品加载中' : '当前筛选下暂无商品'"
          :desc="loading ? '正在准备管理列表，请稍候。' : '可以切换筛选查看其他商品状态。'"
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
.product-card {
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
.product-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #111111;
}

.hero-desc,
.product-desc,
.summary-label,
.meta-pill,
.origin {
  font-size: 24rpx;
  line-height: 1.6;
  color: #6e7380;
}

.summary-row,
.filter-row {
  display: flex;
  gap: 16rpx;
}

.summary-row {
  flex-wrap: wrap;
}

.summary-card {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 24rpx;
  border-radius: 28rpx;
}

.summary-value,
.price {
  font-size: 38rpx;
  font-weight: 700;
  color: #111111;
}

.filter-row {
  flex-wrap: wrap;
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
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.product-card {
  display: flex;
  gap: 20rpx;
  padding: 24rpx;
  border-radius: 36rpx;
}

.product-cover {
  width: 180rpx;
  height: 180rpx;
  border-radius: 28rpx;
  background: #eef0f4;
  flex-shrink: 0;
}

.product-main,
.product-copy {
  display: flex;
  flex-direction: column;
}

.product-main {
  flex: 1;
  gap: 14rpx;
}

.product-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18rpx;
}

.product-copy {
  flex: 1;
  gap: 6rpx;
}

.status-pill {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: rgba(41, 135, 92, 0.12);
  color: #29875c;
  font-size: 22rpx;
  font-weight: 700;
  flex-shrink: 0;
}

.status-pill.off {
  background: rgba(225, 91, 77, 0.12);
  color: #e15b4d;
}

.meta-row,
.price-row,
.action-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-wrap: wrap;
}

.meta-pill {
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: #f7f7fa;
}

.meta-pill.warn {
  color: #db6a3d;
}

.action-row {
  margin-top: 4rpx;
}

.ghost-btn,
.primary-btn {
  min-width: 132rpx;
  height: 72rpx;
  padding: 0 22rpx;
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
