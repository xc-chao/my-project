<script setup lang="ts">
import { onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import PillTabBar from '../../components/PillTabBar.vue';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import QuantityStepper from '../../components/common/QuantityStepper.vue';
import { useCartStore, useUserStore } from '../../store';

const cartStore = useCartStore();
const userStore = useUserStore();

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

onMounted(loadCart);
onShow(() => {
  uni.hideTabBar();
  loadCart();
});
</script>

<template>
  <view class="page-shell">
    <view class="header">
      <view class="title-row">
        <text class="title">购物车</text>
        <text class="title-sub">{{ cartStore.totalCount }} 件商品</text>
      </view>
    </view>

    <view v-if="!userStore.isLoggedIn" class="empty-wrap">
      <EmptyStateCard
        title="登录后查看购物车"
        desc="登录后可继续首页、详情、加购、确认订单的完整链路。"
        action-text="去登录"
        @action="goLogin"
      />
    </view>

    <scroll-view v-else scroll-y class="cart-scroll">
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

      <EmptyStateCard
        v-else
        title="购物车还是空的"
        desc="可以先去首页浏览商品，点击任意商品进入详情页完成加购。"
        action-text="去首页"
        @action="goHome"
      />
    </scroll-view>

    <view v-if="userStore.isLoggedIn" class="bottom-bar">
      <view class="total-wrap">
        <text class="total-label">合计</text>
        <text class="total-price">¥{{ cartStore.totalAmount }}</text>
      </view>
      <view class="checkout-btn" @tap="goCheckout">
        <text>去结算</text>
      </view>
    </view>

    <PillTabBar current="cart" />
  </view>
</template>

<style scoped lang="scss">
.header {
  padding: 20rpx 40rpx 20rpx;
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
  height: calc(100vh - 340rpx);
  padding: 0 40rpx 180rpx;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.cart-card {
  display: flex;
  gap: 24rpx;
  padding: 24rpx;
  border-radius: 40rpx;
  background: #ffffff;
}

.empty-wrap {
  margin: 0 40rpx;
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
  font-size: 36rpx;
  font-weight: 700;
  color: #111111;
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
  height: 96rpx;
  border-radius: 56rpx;
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
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx 40rpx 32rpx;
  background: #f7f7fa;
}

.total-wrap {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  flex: 1;
}

.total-label {
  font-size: 24rpx;
  color: #8c93a1;
}

.checkout-btn {
  min-width: 220rpx;
  padding: 0 40rpx;
  background: #17181c;
  color: #ffffff;
}
</style>
