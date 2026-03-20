<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import UniIcons from "@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue";
import ProductCard from "../../components/ProductCard.vue";
import PillTabBar from "../../components/PillTabBar.vue";
import { getProductList } from "../../services/productService";
import type { ProductItem } from "../../mock/data";
import { pageImageMap } from "../../mock/page-image-map";

const loading = ref(false);
const products = ref<ProductItem[]>([]);
const heroSlides = pageImageMap.home.carousel;
const currentHeroIndex = ref(0);
const agentX = ref(0);
const agentY = ref(0);
const currentHero = computed(() => {
  return heroSlides[currentHeroIndex.value] || heroSlides[0];
});
const metricCards = computed(() => {
  return [
    {
      value: "48h",
      label: "限定上新",
      desc: "暖色精选轮换陈列",
    },
    {
      value: "95%",
      label: "买手好评",
      desc: "球鞋与服饰稳定回购",
    },
    {
      value: `${products.value.length}`,
      label: "首页在列",
      desc: "连续浏览整组单品",
    },
  ];
});

async function loadData() {
  loading.value = true;

  try {
    const result = await getProductList();
    products.value = result.list.slice(0, 50);
  } finally {
    loading.value = false;
  }
}

function openDetail(id: string) {
  uni.navigateTo({
    url: `/pages/product/detail?id=${id}`,
  });
}

function openHeroDetail(productId?: string) {
  if (!productId) {
    return;
  }

  openDetail(productId);
}

function openSearch() {
  uni.switchTab({
    url: "/pages/search/index",
  });
}

function openAgent() {
  uni.navigateTo({
    url: "/pages/chat/index?productId=p_001&title=%E6%99%BA%E8%83%BD%E8%B4%AD%E7%89%A9%E5%8A%A9%E6%89%8B",
  });
}

function handleHeroChange(event: any) {
  currentHeroIndex.value = event.detail.current;
}

function initAgentPosition() {
  const { windowWidth, windowHeight } = uni.getSystemInfoSync();
  const fabWidth = 64;
  const fabHeight = 64;
  const sideGap = 18;
  const bottomGap = 112;

  agentX.value = Math.max(windowWidth - fabWidth - sideGap, sideGap);
  agentY.value = Math.max(windowHeight - fabHeight - bottomGap, 160);
}

onMounted(() => {
  initAgentPosition();
  loadData();
});

onShow(() => {
  uni.hideTabBar();
  initAgentPosition();
});
</script>

<template>
  <view class="page-shell">
    <view class="header">
      <view class="search-bar" @tap="openSearch">
        <view class="search-tag">
          <text>热搜</text>
        </view>
        <text class="search-text">Jordan 1 / NB / 跑鞋 / 卫衣</text>
        <view class="search-btn" @tap.stop="openSearch">
          <UniIcons type="search" :size="14" color="#ffffff" />
          <text>搜索</text>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="content">
      <view class="hero-panel">
        <text class="hero-title">{{ currentHero.title }}</text>
        <view class="hero-copy">
          <text class="hero-desc">{{ currentHero.desc }}</text>
          <text class="hero-badge">{{ currentHero.badge }}</text>
        </view>

        <swiper
          class="hero-swiper"
          circular
          autoplay
          interval="3600"
          duration="450"
          :current="currentHeroIndex"
          @change="handleHeroChange"
        >
          <swiper-item v-for="item in heroSlides" :key="item.image">
            <view class="hero-slide" @tap="openHeroDetail(item.productId)">
              <image class="hero-image" :src="item.image" mode="aspectFill" />
            </view>
          </swiper-item>
        </swiper>

        <view class="hero-dots">
          <view
            v-for="(_, index) in heroSlides"
            :key="index"
            :class="['hero-dot', { active: index === currentHeroIndex }]"
          />
        </view>

        <view class="hero-meta">
          <text class="hero-meta-copy">暖色系主推</text>
          <text class="hero-counter"
            >{{ currentHeroIndex + 1 }}/{{ heroSlides.length }}</text
          >
        </view>
      </view>

      <view class="metric-row">
        <view v-for="item in metricCards" :key="item.label" class="metric-card">
          <view class="metric-card-content">
            <text class="metric-value">{{ item.value }}</text>
            <text class="metric-label">{{ item.label }}</text>
          </view>
          <text class="metric-desc">{{ item.desc }}</text>
        </view>
      </view>

      <view class="section-row">
        <view class="section-copy">
          <text class="section-eyebrow">买手精选</text>
        </view>
        <view class="section-action" @tap="openSearch">
          <text class="section-link">查看全部</text>
        </view>
      </view>

      <view class="product-grid">
        <ProductCard
          v-for="item in products"
          :key="item.id"
          :item="item"
          @select="openDetail(item.id)"
        />
      </view>
    </scroll-view>

    <movable-area class="agent-area">
      <movable-view
        class="agent-fab"
        direction="all"
        inertia
        :x="agentX"
        :y="agentY"
      >
        <view class="agent-fab-inner" @tap="openAgent">
          <view class="agent-icon-wrap">
            <UniIcons type="chat" :size="24" color="#ffffff" />
          </view>
        </view>
      </movable-view>
    </movable-area>

    <PillTabBar current="home" />
  </view>
</template>

<style scoped lang="scss">
.header {
  padding: 20rpx 30rpx 20rpx;
}

.section-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 18rpx;
  height: 104rpx;
  padding: 0 36rpx;
  border-radius: 52rpx;
  background: #ffffff;
  box-shadow: 0 10rpx 24rpx rgba(17, 17, 17, 0.04);
}

.search-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 80rpx;
  height: 52rpx;
  padding: 0 18rpx;
  border-radius: 999rpx;
  background: rgba(219, 106, 61, 0.12);
  color: #db6a3d;
  font-size: 20rpx;
  font-weight: 700;
}

.search-text {
  flex: 1;
  color: #9aa0aa;
  font-size: 28rpx;
}

.search-btn {
  min-width: 124rpx;
  height: 74rpx;
  padding: 0 22rpx;
  border-radius: 37rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  background: #17181c;
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 700;
  flex-shrink: 0;
}

.content {
  padding: 0 40rpx 70rpx;
}

.hero-copy {
  gap: 12rpx;
}

.hero-panel {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  padding: 20rpx 20rpx 24rpx;
  border-radius: 40rpx;
  background: linear-gradient(180deg, #fff4ea 0%, #ffffff 70%);
}

.hero-badge {
  align-self: flex-start;
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(255, 126, 74, 0.12);
  color: #db6a3d;
  font-size: 20rpx;
  font-weight: 700;
}

.hero-title {
  font-size: 35rpx;
  font-weight: 700;
  line-height: 1.18;
  color: #111111;
}

.hero-desc {
  color: #6e7380;
  font-size: 24rpx;
  line-height: 1.65;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hero-swiper {
  width: 100%;
  height: 420rpx;
}

.hero-slide {
  width: 100%;
  height: 100%;
  border-radius: 36rpx;
  overflow: hidden;
  background: linear-gradient(180deg, #fde7da 0%, #fff7f2 100%);
}

.hero-image {
  width: 100%;
  height: 100%;
}

.hero-dots {
  display: flex;
  justify-content: center;
  gap: 10rpx;
}

.hero-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hero-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: rgba(219, 106, 61, 0.18);
}

.hero-dot.active {
  width: 32rpx;
  border-radius: 999rpx;
  background: #db6a3d;
}

.hero-meta-copy {
  font-size: 22rpx;
  color: #8f7768;
}

.hero-counter {
  min-width: 84rpx;
  height: 44rpx;
  padding: 0 16rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(219, 106, 61, 0.1);
  color: #db6a3d;
  font-size: 20rpx;
  font-weight: 700;
}

.metric-row {
  display: flex;
  gap: 16rpx;
  margin-top: 22rpx;
}

.metric-card {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 18rpx 18rpx 20rpx;
  border-radius: 24rpx;
  background: #ffffff;
  border: 1px solid rgba(219, 106, 61, 0.08);
}
.metric-card-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6rpx;
}

.metric-value {
  font-size: 32rpx;
  color: #db6a3d;
  font-weight: 600;
}

.metric-label {
  font-size: 16rpx;
  color: #111111;
  font-weight: 700;
}

.metric-desc {
  font-size: 18rpx;
  line-height: 1.5;
  color: #8c93a1;
}

.section-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24rpx;
  margin-top: 18rpx;
}

.section-copy {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.section-eyebrow {
  font-size: 18rpx;
  color: #db6a3d;
  font-weight: 700;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
}

.section-desc {
  font-size: 22rpx;
  line-height: 1.6;
  color: #6e7380;
}

.section-action {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}

.section-count {
  min-width: 100rpx;
  height: 48rpx;
  padding: 0 18rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(219, 106, 61, 0.1);
  color: #db6a3d;
  font-size: 20rpx;
  font-weight: 700;
}

.section-link {
  font-size: 24rpx;
  color: #6e7380;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 24rpx;
  margin-top: 22rpx;
}

.agent-area {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 30;
}

.agent-fab {
  width: 64px;
  height: 64px;
  pointer-events: auto;
}

.agent-fab-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #00a6ac;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 14rpx 36rpx rgba(17, 17, 17, 0.2);
}

.agent-icon-wrap {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
}

.agent-label {
  color: #1d6b44;
  font-size: 22rpx;
  font-weight: 700;
}
</style>
