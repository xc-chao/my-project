<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AppHeader from '../../components/AppHeader.vue';
import AddressCard from '../../components/common/AddressCard.vue';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import FormSection from '../../components/common/FormSection.vue';
import { pageImageMap } from '../../constants/page-image-map';
import { createOrder, getOrderPreview, type OrderPreviewResponse } from '../../services/orderService';

const preview = ref<OrderPreviewResponse | null>(null);
const remark = ref('');
const submitting = ref(false);

const hasItems = computed(() => Boolean(preview.value?.items.length));

async function loadPreview() {
  preview.value = await getOrderPreview();
}

async function handleSubmit() {
  if (!preview.value?.items.length || submitting.value) {
    return;
  }

  submitting.value = true;

  try {
    const result = await createOrder({
      addressId: preview.value.address?.id,
      remark: remark.value
    });

    uni.showToast({
      title: '订单已提交',
      icon: 'success'
    });

    uni.redirectTo({
      url: `/pages/order/list?highlight=${result.id}`
    });
  } finally {
    submitting.value = false;
  }
}

function goAddress() {
  uni.navigateTo({
    url: '/pages/address/index'
  });
}

function goCart() {
  uni.switchTab({
    url: '/pages/cart/index'
  });
}

onMounted(loadPreview);
</script>

<template>
  <view class="page-shell">
    <AppHeader title="确认订单" back />

    <scroll-view scroll-y class="body">
      <template v-if="hasItems && preview">
        <view class="hero-card">
          <view class="hero-copy">
            <text class="hero-title">确认这次下单</text>
            <text class="hero-desc">核对地址、商品与优惠信息后即可提交订单。</text>
          </view>
          <view class="hero-images">
            <image class="hero-main" :src="pageImageMap.orderConfirm.banner" mode="aspectFill" />
            <image class="hero-accent" :src="pageImageMap.orderConfirm.accent" mode="aspectFill" />
          </view>
        </view>

        <FormSection title="收货地址" desc="默认地址会自动带入，也可在地址管理中调整">
          <AddressCard
            v-if="preview.address"
            :item="preview.address"
            compact
          />
          <view class="link-btn" @tap="goAddress">
            <text>管理地址</text>
          </view>
        </FormSection>

        <FormSection title="商品清单" desc="来自购物车的待结算商品">
          <view v-for="item in preview.items" :key="item.id" class="goods-row">
            <image class="cover" :src="item.product?.cover" mode="aspectFill" />
            <view class="goods-info">
              <text class="goods-title">{{ item.product?.title }}</text>
              <text class="goods-meta">规格 {{ item.size }} · 数量 x{{ item.quantity }}</text>
            </view>
            <text class="goods-price">¥{{ item.product?.price }}</text>
          </view>
        </FormSection>

        <FormSection title="配送与优惠" desc="当前使用标准快递与新人优惠">
          <view class="summary-row">
            <text class="label">商品金额</text>
            <text class="value">¥{{ preview.summary.goodsAmount }}</text>
          </view>
          <view class="summary-row">
            <text class="label">运费</text>
            <text class="value">¥{{ preview.summary.shippingFee }}</text>
          </view>
          <view class="summary-row">
            <text class="label">优惠</text>
            <text class="value">-¥{{ preview.summary.discountAmount }}</text>
          </view>
        </FormSection>

        <FormSection title="订单备注">
          <textarea
            v-model="remark"
            class="remark-input"
            maxlength="100"
            placeholder="给商家留言，如配送时间、发票需求"
          />
        </FormSection>
      </template>

      <EmptyStateCard
        v-else
        title="当前没有待结算商品"
        desc="先去首页浏览商品或回到购物车添加商品后，再继续下单。"
        action-text="返回购物车"
        @action="goCart"
      />
    </scroll-view>

    <view v-if="hasItems && preview" class="bottom-bar">
      <view class="price-wrap">
        <text class="price-label">应付</text>
        <text class="price">¥{{ preview.summary.payableAmount }}</text>
      </view>
      <view class="submit-btn" @tap="handleSubmit">
        <text>{{ submitting ? '提交中' : '提交订单' }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.body {
  height: calc(100vh - 260rpx);
  padding: 8rpx 40rpx 20rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.hero-card {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  padding: 24rpx;
  border-radius: 40rpx;
  background: #ffffff;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.hero-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #111111;
}

.hero-desc {
  font-size: 24rpx;
  line-height: 1.6;
  color: #6e7380;
}

.hero-images {
  display: flex;
  gap: 16rpx;
  height: 220rpx;
}

.hero-main,
.hero-accent {
  border-radius: 28rpx;
  background: #eef0f4;
}

.hero-main {
  flex: 1;
}

.hero-accent {
  width: 180rpx;
}

.link-btn,
.submit-btn {
  height: 88rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 700;
}

.link-btn {
  margin-top: 4rpx;
  background: #f3f4f8;
  color: #111111;
}

.goods-row,
.summary-row,
.bottom-bar,
.price-wrap {
  display: flex;
  align-items: center;
}

.goods-row,
.summary-row {
  justify-content: space-between;
  gap: 18rpx;
}

.goods-row {
  padding: 16rpx 0;
}

.cover {
  width: 128rpx;
  height: 128rpx;
  border-radius: 24rpx;
  background: #eef0f4;
}

.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.goods-title,
.price,
.value {
  color: #111111;
}

.goods-title {
  font-size: 28rpx;
  font-weight: 700;
}

.goods-meta,
.label,
.price-label {
  font-size: 24rpx;
  color: #6e7380;
}

.goods-price,
.price {
  font-size: 32rpx;
  font-weight: 700;
}

.remark-input {
  width: 90%;
  min-height: 180rpx;
  padding: 24rpx;
  border-radius: 28rpx;
  background: #f7f7fa;
  font-size: 24rpx;
  line-height: 1.7;
}

.bottom-bar {
  justify-content: space-between;
  gap: 24rpx;
  padding: 24rpx 40rpx 32rpx;
}

.price-wrap {
  flex-direction: column;
  align-items: flex-start;
  gap: 8rpx;
  flex: 1;
}

.submit-btn {
  min-width: 240rpx;
  padding: 0 32rpx;
  background: #17181c;
  color: #ffffff;
}
</style>
