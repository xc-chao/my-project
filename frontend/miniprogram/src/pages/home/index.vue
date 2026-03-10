<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import ProductCard from '../../components/ProductCard.vue';
import PillTabBar from '../../components/PillTabBar.vue';
import { getProductList } from '../../services/productService';
import type { ProductItem } from '../../mock/data';

const loading = ref(false);
const products = ref<ProductItem[]>([]);
const categories = ref<string[]>([]);
const currentCategory = ref('推荐');

const filteredProducts = computed(() => {
  if (currentCategory.value === '推荐') {
    return products.value;
  }

  return products.value.filter((item) => item.category === currentCategory.value);
});

async function loadData() {
  loading.value = true;

  try {
    const result = await getProductList();
    products.value = result.list;
    categories.value = result.categories;
  } finally {
    loading.value = false;
  }
}

function openDetail(id: string) {
  uni.navigateTo({
    url: `/pages/product/detail?id=${id}`
  });
}

function openSearch() {
  uni.navigateTo({
    url: '/pages/search/index'
  });
}

onMounted(loadData);

onShow(() => {
  uni.hideTabBar();
});
</script>

<template>
  <view class="page-shell">
    <view class="header">
      <view class="status-row">
        <text class="time">9:41</text>
        <text class="signal">5G 100%</text>
      </view>
      <view class="top-copy">
        <text class="eyebrow">校园精选</text>
        <text class="title">得物风格精选</text>
      </view>
      <view class="search-bar" @tap="openSearch">
        <text class="search-text">搜索鞋服、数码、热销新品</text>
      </view>
    </view>

    <scroll-view scroll-y class="content">
      <view class="hero-card">
        <text class="hero-badge">AIGC 导购</text>
        <text class="hero-title">浏览、咨询、下单一体化</text>
        <text class="hero-desc">商品详情页支持直接发起 AI 咨询，后续接入真实 Agent 对话链路。</text>
      </view>

      <scroll-view scroll-x class="category-scroll" show-scrollbar="false">
        <view class="category-row">
          <view
            v-for="item in ['推荐', ...categories]"
            :key="item"
            :class="['category-pill', { active: currentCategory === item }]"
            @tap="currentCategory = item"
          >
            <text>{{ item }}</text>
          </view>
        </view>
      </scroll-view>

      <view class="section-row">
        <text class="section-title">热销推荐</text>
        <text class="section-link" @tap="openSearch">查看全部</text>
      </view>

      <view class="product-grid">
        <ProductCard
          v-for="item in filteredProducts"
          :key="item.id"
          :item="item"
          @select="openDetail(item.id)"
        />
      </view>

      <view class="agent-fab">
        <text class="agent-label">AI 购物助手</text>
      </view>
    </scroll-view>

    <PillTabBar current="home" />
  </view>
</template>

<style scoped lang="scss">
.header {
  padding: 0 40rpx 20rpx;
}

.status-row,
.section-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-row {
  height: 62px;
}

.time {
  font-size: 30rpx;
  font-weight: 700;
}

.signal {
  font-size: 24rpx;
  font-weight: 600;
}

.top-copy {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.eyebrow {
  color: #8c93a1;
  font-size: 24rpx;
  font-weight: 600;
}

.title {
  font-size: 56rpx;
  font-weight: 700;
}

.search-bar {
  display: flex;
  align-items: center;
  height: 104rpx;
  margin-top: 24rpx;
  padding: 0 36rpx;
  border-radius: 52rpx;
  background: #ffffff;
}

.search-text {
  color: #9aa0aa;
  font-size: 28rpx;
}

.content {
  height: calc(100vh - 220rpx);
  padding: 0 40rpx 180rpx;
}

.hero-card {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 40rpx;
  border-radius: 56rpx;
  background: linear-gradient(135deg, #ffffff 0%, #f3f4f8 60%, #eeeafb 100%);
}

.hero-badge {
  align-self: flex-start;
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #6e7380;
  font-size: 22rpx;
  font-weight: 600;
}

.hero-title {
  font-size: 44rpx;
  font-weight: 700;
}

.hero-desc {
  color: #6e7380;
  font-size: 26rpx;
  line-height: 1.6;
}

.category-scroll {
  margin-top: 32rpx;
  white-space: nowrap;
}

.category-row {
  display: inline-flex;
  gap: 16rpx;
}

.category-pill {
  padding: 18rpx 28rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #6e7380;
  font-size: 24rpx;
  font-weight: 600;
}

.category-pill.active {
  background: #17181c;
  color: #ffffff;
}

.section-row {
  margin-top: 36rpx;
}

.section-title {
  font-size: 34rpx;
  font-weight: 700;
}

.section-link {
  font-size: 24rpx;
  color: #6e7380;
}

.product-grid {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-top: 20rpx;
}

.agent-fab {
  position: fixed;
  right: 40rpx;
  bottom: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 180rpx;
  height: 84rpx;
  padding: 0 28rpx;
  border-radius: 999rpx;
  background: #17181c;
  box-shadow: 0 16rpx 40rpx rgba(17, 17, 17, 0.16);
}

.agent-label {
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 700;
}
</style>
