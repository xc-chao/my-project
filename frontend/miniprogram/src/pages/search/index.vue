<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import PillTabBar from '../../components/PillTabBar.vue';
import ProductCard from '../../components/ProductCard.vue';
import { getProductList } from '../../services/productService';
import type { ProductItem } from '../../types/domain';
import { pageImageMap } from '../../constants/page-image-map';
import {
  consumeSearchPreset,
  getSearchFilterLabel,
  resolveSearchFilterQuery,
  type ProductSearchFilterKey,
  type ProductSearchPreset,
  type ProductSearchSort
} from '../../utils/product-search';

const keyword = ref('');
const list = ref<ProductItem[]>([]);
const loading = ref(false);
const initialized = ref(false);
const sort = ref<ProductSearchSort>('comprehensive');
const filterKey = ref<ProductSearchFilterKey>('all');
const inspirationCards = pageImageMap.search.inspiration;
const filterOptions: Array<{ key: ProductSearchFilterKey; label: string }> = [
  { key: 'all', label: '全部商品' },
  { key: 'newIn48h', label: '48h 上新' },
  { key: 'buyerFavorite', label: '买手好评' },
  { key: 'onSale', label: '仅看在售' },
  { key: 'categoryShoes', label: '鞋靴' },
  { key: 'categoryClothes', label: '服饰' },
  { key: 'categoryAccessories', label: '配件' }
];

const filterPills = computed(() => {
  return [
    {
      key: 'comprehensive',
      label: '综合',
      active: sort.value === 'comprehensive'
    },
    {
      key: 'price',
      label:
        sort.value === 'priceAsc'
          ? '价格↑'
          : sort.value === 'priceDesc'
            ? '价格↓'
            : '价格',
      active: sort.value === 'priceAsc' || sort.value === 'priceDesc'
    },
    {
      key: 'filter',
      label: getSearchFilterLabel(filterKey.value),
      active: filterKey.value !== 'all'
    }
  ] as const;
});

const activeTags = computed(() => {
  const tags: string[] = [];

  if (sort.value === 'priceAsc') {
    tags.push('价格升序');
  } else if (sort.value === 'priceDesc') {
    tags.push('价格降序');
  }

  if (filterKey.value !== 'all') {
    tags.push(getSearchFilterLabel(filterKey.value));
  }

  return tags;
});

const resultTitle = computed(() => {
  const normalizedKeyword = keyword.value.trim();

  if (normalizedKeyword) {
    return normalizedKeyword;
  }

  return filterKey.value === 'all' ? '全部商品' : getSearchFilterLabel(filterKey.value);
});

function applySearchPreset(preset: ProductSearchPreset) {
  keyword.value = preset.keyword || '';
  sort.value = preset.sort || 'comprehensive';
  filterKey.value = preset.filterKey || 'all';
}

async function loadSearch() {
  loading.value = true;

  try {
    const result = await getProductList({
      keyword: keyword.value.trim(),
      sort: sort.value,
      ...resolveSearchFilterQuery(filterKey.value)
    });
    list.value = result.list;
  } finally {
    loading.value = false;
    initialized.value = true;
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

function resetToComprehensive() {
  if (sort.value === 'comprehensive') {
    return;
  }

  sort.value = 'comprehensive';
  loadSearch();
}

function togglePriceSort() {
  sort.value = sort.value === 'priceAsc' ? 'priceDesc' : 'priceAsc';
  loadSearch();
}

function openFilterSheet() {
  uni.showActionSheet({
    itemList: filterOptions.map((item) => item.label),
    success: (result) => {
      const next = filterOptions[result.tapIndex];

      if (!next) {
        return;
      }

      filterKey.value = next.key;
      loadSearch();
    },
    fail: () => {}
  });
}

function handlePillTap(key: 'comprehensive' | 'price' | 'filter') {
  if (key === 'comprehensive') {
    resetToComprehensive();
    return;
  }

  if (key === 'price') {
    togglePriceSort();
    return;
  }

  openFilterSheet();
}

onLoad((query) => {
  if (typeof query?.keyword === 'string') {
    keyword.value = decodeURIComponent(query.keyword);
  }
});

onShow(() => {
  uni.hideTabBar();

  const preset = consumeSearchPreset();

  if (preset) {
    applySearchPreset(preset);
    loadSearch();
    return;
  }

  if (!initialized.value) {
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
            v-for="item in filterPills"
            :key="item.key"
            :class="['filter-pill', { active: item.active }]"
            @tap="handlePillTap(item.key)"
          >
            <text>{{ item.label }}</text>
          </view>
        </view>
        <text class="page-desc">{{ resultTitle }} 共 {{ list.length }} 件商品</text>

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

.active-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 14rpx;
}

.active-tag {
  padding: 10rpx 16rpx;
  border-radius: 999rpx;
  background: rgba(23, 24, 28, 0.08);
  color: #17181c;
  font-size: 20rpx;
  font-weight: 700;
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
