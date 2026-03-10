<script setup lang="ts">
import { onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import PillTabBar from '../../components/PillTabBar.vue';
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

onMounted(loadCart);
onShow(() => {
  uni.hideTabBar();
  loadCart();
});
</script>

<template>
  <view class="page-shell">
    <view class="header">
      <view class="status-row">
        <text class="time">9:41</text>
        <text class="signal">5G 100%</text>
      </view>
      <view class="title-row">
        <text class="title">购物车</text>
        <text class="title-sub">{{ cartStore.totalCount }} 件商品</text>
      </view>
    </view>

    <view v-if="!userStore.isLoggedIn" class="empty-card">
      <text class="empty-title">登录后查看购物车</text>
      <text class="empty-desc">已接好登录链路，登录后可继续“首页 → 详情 → 加购”的首条流程。</text>
      <view class="login-btn" @tap="goLogin">
        <text>去登录</text>
      </view>
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
              <view class="qty-btn" @tap="cartStore.changeQuantity(item.id, item.quantity - 1)">
                <text>-</text>
              </view>
              <text class="qty-value">{{ item.quantity }}</text>
              <view class="qty-btn" @tap="cartStore.changeQuantity(item.id, item.quantity + 1)">
                <text>+</text>
              </view>
              <text class="remove" @tap="cartStore.remove(item.id)">移除</text>
            </view>
          </view>
        </view>
      </view>

      <view v-else class="empty-card">
        <text class="empty-title">购物车还是空的</text>
        <text class="empty-desc">可以先去首页浏览商品，点击任意商品进入详情页完成加购。</text>
      </view>
    </scroll-view>

    <view v-if="userStore.isLoggedIn" class="bottom-bar">
      <view class="total-wrap">
        <text class="total-label">合计</text>
        <text class="total-price">¥{{ cartStore.totalAmount }}</text>
      </view>
      <view class="checkout-btn">
        <text>去结算</text>
      </view>
    </view>

    <PillTabBar current="cart" />
  </view>
</template>

<style scoped lang="scss">
.header {
  padding: 0 40rpx 20rpx;
}

.status-row,
.title-row,
.qty-row {
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

.cart-card,
.empty-card {
  display: flex;
  gap: 24rpx;
  padding: 24rpx;
  border-radius: 40rpx;
  background: #ffffff;
}

.empty-card {
  margin: 0 40rpx;
  flex-direction: column;
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

.cart-title,
.empty-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #111111;
}

.cart-sub,
.empty-desc {
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

.qty-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  background: #f3f4f8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-value {
  width: 40rpx;
  text-align: center;
  font-size: 26rpx;
  font-weight: 700;
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
