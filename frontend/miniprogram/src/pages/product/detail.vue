<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import QuantityStepper from '../../components/common/QuantityStepper.vue';
import { getProductDetail } from '../../services/productService';
import { useCartStore, useUserStore } from '../../store';
import type { ProductItem } from '../../mock/data';

const product = ref<ProductItem | null>(null);
const selectedSize = ref('');
const quantity = ref(1);
const loading = ref(false);
const previewImage = ref('');
const cartStore = useCartStore();
const userStore = useUserStore();

const totalPrice = computed(() => {
  return (product.value?.price || 0) * quantity.value;
});

async function loadDetail(id: string) {
  loading.value = true;

  try {
    const result = await getProductDetail(id);
    if (result) {
      product.value = result;
      selectedSize.value = result.sizes[0];
      previewImage.value = result.gallery?.[0] || result.cover;
    }
  } finally {
    loading.value = false;
  }
}

async function handleAddToCart() {
  if (!product.value) {
    return;
  }

  if (!userStore.isLoggedIn) {
    uni.navigateTo({
      url: '/pages/auth/login'
    });
    return;
  }

  await cartStore.add({
    productId: product.value.id,
    quantity: quantity.value,
    size: selectedSize.value
  });

  uni.showToast({
    title: '已加入购物车',
    icon: 'success'
  });
}

async function handleBuyNow() {
  await handleAddToCart();

  if (!userStore.isLoggedIn) {
    return;
  }

  uni.navigateTo({
    url: '/pages/order/confirm'
  });
}

onLoad((query) => {
  const productId = query?.id;

  if (typeof productId === 'string') {
    loadDetail(productId);
  }
});

function openChat() {
  if (!product.value) {
    return;
  }

  if (!userStore.isLoggedIn) {
    uni.navigateTo({
      url: '/pages/auth/login'
    });
    return;
  }

  uni.navigateTo({
    url: `/pages/chat/index?productId=${product.value.id}&title=${encodeURIComponent(product.value.title)}`
  });
}
</script>

<template>
  <view class="page-shell">
    <AppHeader
      title="商品详情"
      back
      dark-action="AI"
      :action-path="product ? `/pages/chat/index?productId=${product.id}&title=${encodeURIComponent(product.title)}` : ''"
    />

    <scroll-view scroll-y class="detail-scroll" v-if="product">
      <image class="cover" :src="previewImage || product.cover" mode="aspectFill" />

      <view class="thumb-row" v-if="product.gallery?.length">
        <image
          v-for="item in product.gallery"
          :key="item"
          :class="['thumb-image', { active: previewImage === item }]"
          :src="item"
          mode="aspectFill"
          @tap="previewImage = item"
        />
      </view>

      <view class="card">
        <text class="title">{{ product.title }}</text>
        <text class="subtitle">{{ product.subtitle }}</text>
        <view class="price-row">
          <text class="price">¥{{ product.price }}</text>
          <text class="origin">¥{{ product.originalPrice }}</text>
          <text class="stock">库存 {{ product.stock }}</text>
        </view>
      </view>

      <text class="section-title">选择尺码</text>
      <view class="size-row">
        <view
          v-for="size in product.sizes"
          :key="size"
          :class="['size-pill', { active: selectedSize === size }]"
          @tap="selectedSize = size"
        >
          <text>{{ size }}</text>
        </view>
      </view>

      <view class="card">
        <text class="section-title">商品说明</text>
        <text class="desc">{{ product.detail }}</text>
        <text class="desc">销量 {{ product.sales }}，支持 7 天无理由退货与 AI 商品咨询。</text>
        <view class="ai-entry" @tap="openChat">
          <text class="ai-entry-text">问问 AI：尺码、材质、发货、售后</text>
        </view>
      </view>

      <view class="card" v-if="product.gallery?.length">
        <text class="section-title">细节展示</text>
        <view class="detail-gallery">
          <image
            v-for="item in product.gallery"
            :key="`detail-${item}`"
            class="detail-image"
            :src="item"
            mode="aspectFill"
          />
        </view>
      </view>

      <view class="card quantity-card">
        <text class="section-title">购买数量</text>
        <QuantityStepper v-model="quantity" />
      </view>
    </scroll-view>

    <view class="bottom-bar" v-if="product">
      <view class="bottom-copy">
        <text class="bottom-label">合计</text>
        <text class="bottom-price">¥{{ totalPrice }}</text>
      </view>
      <view class="actions">
        <view class="ghost-btn" @tap="handleAddToCart">
          <text>加入购物车</text>
        </view>
        <view class="primary-btn" @tap="handleBuyNow">
          <text>立即购买</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.detail-scroll {
  height: calc(100vh - 320rpx);
  padding: 16rpx 40rpx 40rpx;
}

.cover {
  width: 100%;
  height: 640rpx;
  border-radius: 56rpx;
  background: #eef0f4;
}

.thumb-row {
  display: flex;
  gap: 16rpx;
  margin-top: 20rpx;
}

.thumb-image {
  width: calc((100% - 32rpx) / 3);
  height: 160rpx;
  border-radius: 28rpx;
  background: #eef0f4;
  opacity: 0.72;
}

.thumb-image.active {
  opacity: 1;
  box-shadow: 0 0 0 4rpx rgba(17, 17, 17, 0.08);
}

.card {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  margin-top: 24rpx;
  padding: 32rpx;
  border-radius: 48rpx;
  background: #ffffff;
}

.title,
.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #111111;
}

.subtitle,
.desc,
.stock {
  font-size: 26rpx;
  line-height: 1.6;
  color: #6e7380;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 16rpx;
  flex-wrap: wrap;
}

.price,
.bottom-price {
  font-size: 42rpx;
  font-weight: 700;
  color: #111111;
}

.origin {
  font-size: 24rpx;
  color: #9aa0aa;
  text-decoration: line-through;
}

.section-title {
  display: block;
  margin-top: 28rpx;
}

.size-row {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
  margin-top: 18rpx;
}

.size-pill {
  min-width: 120rpx;
  padding: 18rpx 24rpx;
  border-radius: 999rpx;
  background: #ffffff;
  text-align: center;
  font-size: 26rpx;
  color: #6e7380;
}

.size-pill.active {
  background: #17181c;
  color: #ffffff;
}

.quantity-card {
  margin-bottom: 24rpx;
}

.ai-entry {
  margin-top: 8rpx;
  padding: 22rpx 24rpx;
  border-radius: 28rpx;
  background: #17181c;
}

.ai-entry-text {
  font-size: 24rpx;
  font-weight: 700;
  color: #ffffff;
}

.detail-gallery {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.detail-image {
  width: 100%;
  height: 360rpx;
  border-radius: 32rpx;
  background: #eef0f4;
}

.bottom-bar {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx 40rpx 32rpx;
  background: #f7f7fa;
}

.bottom-copy {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  flex: 1;
}

.bottom-label {
  font-size: 24rpx;
  color: #8c93a1;
}

.actions {
  display: flex;
  gap: 16rpx;
}

.ghost-btn,
.primary-btn {
  min-width: 180rpx;
  height: 96rpx;
  padding: 0 32rpx;
  border-radius: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 700;
}

.ghost-btn {
  background: #ffffff;
  color: #111111;
  border: 1px solid #e7e9ee;
}

.primary-btn {
  background: #17181c;
  color: #ffffff;
}
</style>
