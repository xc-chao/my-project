<script setup lang="ts">
import { ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import PillTabBar from '../../components/PillTabBar.vue';
import ProductCard from '../../components/ProductCard.vue';
import { getProductList, searchProducts } from '../../services/productService';
import type { ProductItem } from '../../mock/data';
import { pageImageMap } from '../../mock/page-image-map';

const keyword = ref('');
const list = ref<ProductItem[]>([]);
const loading = ref(false);
const filters = ['综合', '价格', '筛选'];
const currentFilter = ref('综合');
const inspirationCards = pageImageMap.search.inspiration;

async function loadSearch() {
  loading.value = true;

  try {
    if (!keyword.value.trim()) {
      const result = await getProductList();
      list.value = result.list;
      return;
    }

    const result = await searchProducts(keyword.value);
    list.value = result.list;
  } finally {
    loading.value = false;
  }
}

function openDetail(id: string) {
  uni.navigateTo({
    url: `/pages/product/detail?id=${id}`
  });
}

function goHome() {
  uni.switchTab({
    url: '/pages/home/index'
  });
}

onLoad((query) => {
  if (typeof query?.keyword === 'string') {
    keyword.value = decodeURIComponent(query.keyword);
  }

  loadSearch();
});

onShow(() => {
  uni.hideTabBar();

  if (!list.value.length) {
    loadSearch();
  }
});
</script>

<template>
  <view class="page-shell">
    <scroll-view scroll-y class="page-scroll">
      <view class="body">
        <view class="search-bar">
          <input
            v-model="keyword"
            class="search-input"
            placeholder="Jordan 1"
            confirm-type="search"
            @confirm="loadSearch"
          />
          <view class="search-btn" @tap="loadSearch">
            <text>搜索</text>
          </view>
        </view>

        <view class="filter-row">
          <view
            v-for="item in filters"
            :key="item"
            :class="['filter-pill', { active: currentFilter === item }]"
            @tap="currentFilter = item"
          >
            <text>{{ item }}</text>
          </view>
        </view>
        <text class="page-desc">{{ keyword || '全部商品' }} 共 {{ list.length }} 件商品</text>

        <scroll-view scroll-x class="inspiration-scroll" show-scrollbar="false">
          <view class="inspiration-row">
            <view v-for="item in inspirationCards" :key="item.title" class="inspiration-card">
              <image class="inspiration-image" :src="item.image" mode="aspectFill" />
              <text class="inspiration-title">{{ item.title }}</text>
              <text class="inspiration-desc">{{ item.desc }}</text>
            </view>
          </view>
        </scroll-view>

        <view v-if="list.length" class="result-list">
          <ProductCard
            v-for="item in list"
            :key="item.id"
            :item="item"
            @select="openDetail(item.id)"
          />
        </view>

        <view v-else class="empty-card-wrap">
          <EmptyStateCard
            title="暂无匹配商品"
            desc="可以尝试更换关键词，或者返回首页查看推荐商品。"
            action-text="回首页"
            @action="goHome"
          />
        </view>
      </view>
    </scroll-view>

    <PillTabBar current="search" />
  </view>
</template>

<style scoped lang="scss">
.page-shell {
  min-height: 100vh;
}

.page-scroll {
  height: calc(100vh - 150rpx);
}

.body {
  padding: 20rpx 40rpx 100rpx;
}

.page-title {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: #111111;
}

.page-desc {
  display: block;
  margin-top: 14rpx;
  font-size: 22rpx;
  color: #6e7380;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-top: 22rpx;
  padding: 12rpx;
  border-radius: 52rpx;
  background: #ffffff;
}

.search-input {
  flex: 1;
  height: 80rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
}

.search-btn {
  min-width: 120rpx;
  height: 80rpx;
  padding: 0 24rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #17181c;
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 700;
}

.filter-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 20rpx;
}

.filter-pill {
  padding: 12rpx 18rpx;
  border-radius: 999rpx;
  background: #f0f1f4;
  color: #8c93a1;
  font-size: 20rpx;
  font-weight: 600;
}

.filter-pill.active {
  background: #17181c;
  color: #ffffff;
}

.inspiration-scroll {
  margin-top: 22rpx;
  white-space: nowrap;
}

.inspiration-row {
  display: inline-flex;
  gap: 18rpx;
  padding-right: 10rpx;
}

.inspiration-card {
  width: 260rpx;
  padding: 16rpx;
  border-radius: 32rpx;
  background: #ffffff;
}

.inspiration-image {
  width: 100%;
  height: 180rpx;
  border-radius: 24rpx;
  background: #eef0f4;
}

.inspiration-title {
  display: block;
  margin-top: 16rpx;
  font-size: 24rpx;
  font-weight: 700;
  color: #111111;
}

.inspiration-desc {
  display: block;
  margin-top: 8rpx;
  font-size: 20rpx;
  color: #8c93a1;
}

.result-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 24rpx;
  margin-top: 22rpx;
  padding-bottom: 30rpx;
}

.empty-card-wrap {
  margin-top: 22rpx;
  padding-bottom: 30rpx;
}

</style>
