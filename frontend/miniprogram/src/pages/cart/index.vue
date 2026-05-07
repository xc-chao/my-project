<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import PillTabBar from '../../components/PillTabBar.vue';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import QuantityStepper from '../../components/common/QuantityStepper.vue';
import { pageImageMap } from '../../constants/page-image-map';
import { useCartStore, useUserStore } from '../../store';

const cartStore = useCartStore();
const userStore = useUserStore();
const safeBottomRpx = ref(0);

const layoutStyle = computed(() => ({
  '--cart-tabbar-offset': `${140 + safeBottomRpx.value}rpx`,
  '--cart-scroll-bottom': `${300 + safeBottomRpx.value}rpx`
}));

async function loadCart() {
  if (!userStore.isLoggedIn) {
    return;
  }

  await cartStore.fetchCart();
}

function goLogin() {
  uni.navigateTo({
    url: '/pages/auth/login'
  });
}

function goCheckout() {
  if (!cartStore.list.length) {
    return;
  }

  uni.navigateTo({
    url: '/pages/order/confirm'
  });
}

function goHome() {
  uni.switchTab({
    url: '/pages/home/index'
  });
}

function updateSafeBottom() {
  const systemInfo = uni.getSystemInfoSync();
  const windowWidth = systemInfo.windowWidth || 375;
  const safeAreaInsets = systemInfo.safeAreaInsets;
  const safeAreaBottom = systemInfo.safeArea?.bottom;
  const bottomInsetPx = safeAreaInsets?.bottom ?? Math.max(0, systemInfo.screenHeight - (safeAreaBottom || systemInfo.screenHeight));

  safeBottomRpx.value = Math.round((bottomInsetPx * 750) / windowWidth);
}

onMounted(loadCart);
onShow(() => {
  uni.hideTabBar();
  updateSafeBottom();
  loadCart();
});
</script>

<template>
  <view class="page-shell" :style="layoutStyle">
    <view v-if="!userStore.isLoggedIn" class="empty-wrap">
      <EmptyStateCard
        title="登录后查看购物车"
        desc="登录后可继续首页、详情、加购、确认订单的完整链路。"
        action-text="去登录"
        @action="goLogin"
      />
    </view>

    <scroll-view v-else scroll-y class="cart-scroll">
      <view class="cart-banner">
        <view class="banner-copy">
          <text class="banner-title">待结算清单</text>
          <text class="banner-desc">把喜欢的球鞋与穿搭先收进购物车，再统一挑尺码和下单。</text>
        </view>
        <view class="banner-images">
          <image class="banner-main" :src="pageImageMap.cart.banner" mode="aspectFill" />
        </view>
      </view>

      <view v-if="cartStore.list.length" class="cart-list">
        <view v-for="item in cartStore.list" :key="item.id" class="cart-card">
          <image class="cart-cover" :src="item.product?.cover" mode="aspectFill" />
          <view class="cart-info">
            <text class="cart-title">{{ item.product?.title }}</text>
            <text class="cart-sub">尺码 {{ item.size }}</text>
            <text class="cart-price">¥{{ item.product?.price }}</text>
            <view class="qty-row">
              <QuantityStepper
                :model-value="item.quantity"
                @update:model-value="cartStore.changeQuantity(item.id, $event)"
              />
              <text class="remove" @tap="cartStore.remove(item.id)">移除</text>
            </view>
          </view>
        </view>
      </view>

      <view v-else class="empty-card-wrap">
        <EmptyStateCard
          title="购物车还是空的"
          desc="先去首页挑几双球鞋或几件穿搭，加入购物车后就能在这里统一结算。"
          action-text="去首页"
          @action="goHome"
        />
      </view>
    </scroll-view>

    <view v-if="userStore.isLoggedIn && cartStore.list.length" class="bottom-bar">
      <view class="total-wrap">
        <text class="total-label">合计:</text>
        <text class="total-price">¥{{ cartStore.totalAmount }}</text>
      </view>
      <text class="title-sub">{{ cartStore.totalCount }} 件商品</text>
      <view class="checkout-btn" @tap="goCheckout">
        <text>去结算</text>
      </view>
    </view>

    <PillTabBar current="cart" />
  </view>
</template>

<style scoped lang="scss">

.page-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 20rpx;
}

.title-row,
.qty-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 56rpx;
  font-weight: 700;
}

.title-sub {
  font-size: 24rpx;
  color: #8c93a1;
}

.cart-scroll {
  flex: 1;
  height: 0;
  padding: 0 30rpx var(--cart-scroll-bottom);
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.page-title {
  font-size: 52rpx;
  font-weight: 700;
  color: #111111;
}

.page-desc {
  font-size: 22rpx;
  line-height: 1.6;
  color: #6e7380;
}

.count-pill {
  min-width: 104rpx;
  height: 52rpx;
  padding: 0 18rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(219, 106, 61, 0.1);
  color: #db6a3d;
  font-size: 20rpx;
  font-weight: 700;
  flex-shrink: 0;
}

.cart-banner {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  height: 330px;
  margin-bottom: 24rpx;
  padding: 24rpx;
  border-radius: 40rpx;
  background: #ffffff;
}

.banner-copy {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.banner-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #111111;
}

.banner-desc {
  font-size: 24rpx;
  line-height: 1.6;
  color: #6e7380;
}

.banner-images {
  display: flex;
  gap: 16rpx;
  height: 220rpx;
}

.banner-main,
.banner-accent {
  border-radius: 28rpx;
  background: #eef0f4;
}

.banner-main {
  flex: 1;
}

.banner-accent {
  width: 180rpx;
}

.cart-card {
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
  padding: 24rpx;
  border-radius: 32rpx;
  background: #ffffff;
  border: 1px solid #eef0f4;
  box-shadow: 0 10rpx 28rpx rgba(17, 17, 17, 0.04);
}

.empty-wrap {
  margin: 0 40rpx;
}

.empty-card-wrap {
  padding-bottom: 40rpx;
}

.cart-cover {
  width: 180rpx;
  height: 180rpx;
  border-radius: 24rpx;
  background: #eef0f4;
}

.cart-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.cart-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  font-size: 30rpx;
  font-weight: 700;
  color: #111111;
}

.cart-sub {
  font-size: 24rpx;
  line-height: 1.6;
  color: #6e7380;
}

.cart-price,
.total-price {
 font-size: 28rpx;
  font-weight: 700;
  color: #f25a52;
}

.qty-row {
  justify-content: flex-start;
  gap: 20rpx;
  margin-top: auto;
}

.remove {
  margin-left: auto;
  font-size: 24rpx;
  color: #e94b45;
}

.login-btn,
.checkout-btn {
  height: 64rpx;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 700;
}

.login-btn {
  background: #17181c;
  color: #ffffff;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: var(--cart-tabbar-offset);
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 24rpx;
  min-height: 112rpx;
  padding: 18rpx 32rpx;
  background: #f7f7fa;
  border-top: 1px solid #eceef2;
  box-shadow: 0 -10rpx 28rpx rgba(17, 17, 17, 0.04);
}

.total-wrap {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 6rpx;
  flex: 1;
}

.total-label {
  font-size: 32rpx;
  color: #111111;
  font-weight: 600;
}

.checkout-btn {
  padding: 0 40rpx;
  background: #17181c;
  color: #ffffff;
}
</style>
