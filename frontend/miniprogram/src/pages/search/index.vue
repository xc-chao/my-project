<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import ProductCard from '../../components/ProductCard.vue';
import { getProductList, searchProducts } from '../../services/productService';
import type { ProductItem } from '../../mock/data';

const keyword = ref('');
const list = ref<ProductItem[]>([]);
const loading = ref(false);

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
</script>

<template>
  <view class="page-shell">
    <AppHeader title="搜索结果" back />

    <view class="body">
      <view class="search-bar">
        <input
          v-model="keyword"
          class="search-input"
          placeholder="搜索鞋服、数码、关键词"
          confirm-type="search"
          @confirm="loadSearch"
        />
        <view class="search-btn" @tap="loadSearch">
          <text>搜索</text>
        </view>
      </view>

      <view class="meta-row">
        <text class="meta-title">“{{ keyword || '推荐' }}”</text>
        <text class="meta-desc">{{ list.length }} 个结果</text>
      </view>

      <scroll-view scroll-y class="result-scroll">
        <view v-if="list.length" class="result-list">
          <ProductCard
            v-for="item in list"
            :key="item.id"
            :item="item"
            @select="openDetail(item.id)"
          />
        </view>

        <EmptyStateCard
          v-else
          title="暂无匹配商品"
          desc="可以尝试更换关键词，或者返回首页查看推荐商品。"
          action-text="回首页"
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

.search-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
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

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 28rpx;
}

.meta-title {
  font-size: 34rpx;
  font-weight: 700;
}

.meta-desc {
  font-size: 24rpx;
  color: #8c93a1;
}

.result-scroll {
  height: calc(100vh - 280rpx);
  margin-top: 20rpx;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding-bottom: 40rpx;
}

</style>
