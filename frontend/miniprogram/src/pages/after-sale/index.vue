<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import FormSection from '../../components/common/FormSection.vue';
import { mockProducts } from '../../mock/data';
import { pageImageMap } from '../../mock/page-image-map';
import { createAfterSale, getAfterSaleList, type AfterSaleItem } from '../../services/afterSaleService';

const list = ref<AfterSaleItem[]>([]);
const form = reactive({
  orderId: '',
  productTitle: '',
  reason: ''
});

const hasSeedData = computed(() => Boolean(list.value.length));

async function loadList() {
  list.value = await getAfterSaleList();
}

async function handleSubmit() {
  if (!form.orderId || !form.productTitle || !form.reason) {
    uni.showToast({
      title: '请补全售后信息',
      icon: 'none'
    });
    return;
  }

  const created = await createAfterSale(form);
  list.value = [created, ...list.value];
  form.reason = '';

  uni.showToast({
    title: '提交成功',
    icon: 'success'
  });
}

function formatStatus(status: string) {
  return (
    {
      submitted: '已提交',
      reviewing: '审核中',
      approved: '已通过',
      rejected: '已驳回'
    }[status] || status
  );
}

function getProductCover(title: string) {
  return mockProducts.find((item) => item.title === title)?.cover || pageImageMap.afterSale.accent;
}

onLoad((query) => {
  if (typeof query?.orderId === 'string') {
    form.orderId = query.orderId;
  }

  if (typeof query?.productTitle === 'string') {
    form.productTitle = decodeURIComponent(query.productTitle);
  }
});

onMounted(loadList);
</script>

<template>
  <view class="page-shell">
    <AppHeader title="售后申请" back />

    <scroll-view scroll-y class="body">
      <view class="hero-card">
        <view class="hero-copy">
          <text class="hero-title">售后与进度追踪</text>
          <text class="hero-desc">支持提交原因说明，并统一查看审核结果与处理状态。</text>
        </view>
      </view>

      <FormSection title="发起申请" desc="支持填写订单号、商品名称与售后原因">
        <input v-model="form.orderId" class="field" placeholder="订单号" />
        <input v-model="form.productTitle" class="field" placeholder="商品名称" />
        <textarea
          v-model="form.reason"
          class="field textarea"
          placeholder="请描述问题，例如尺寸不合适、外观瑕疵、功能异常"
        />
        <view class="submit-btn" @tap="handleSubmit">
          <text>提交申请</text>
        </view>
      </FormSection>

      <view v-if="hasSeedData" class="list">
        <view v-for="item in list" :key="item.id" class="record-card">
          <image class="record-cover" :src="getProductCover(item.productTitle)" mode="aspectFill" />
          <view class="record-content">
            <view class="record-row">
              <text class="title">{{ item.productTitle }}</text>
              <text class="status">{{ formatStatus(item.status) }}</text>
            </view>
            <text class="meta">订单 {{ item.orderId }}</text>
            <text class="reason">{{ item.reason }}</text>
          </view>
        </view>
      </view>

      <EmptyStateCard
        v-else
        title="暂无售后记录"
        desc="提交售后申请后，会在这里看到审核进度与结果。"
      />
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.body {
  height: calc(100vh - 180rpx);
  padding: 8rpx 40rpx 40rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.hero-card {
  display: flex;
  flex-direction: column;
  padding: 24rpx;
  margin-bottom: 20rpx;
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

.field {
  width: 100%;
  height: 82rpx;
  padding: 0 10rpx;
  border-radius: 24rpx;
  background: #f7f7fa;
  font-size: 24rpx;
}

.textarea {
  min-height: 180rpx;
  padding: 10rpx;
}

.submit-btn {
  height: 92rpx;
  border-radius: 46rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #17181c;
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 700;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.record-card {
  display: flex;
  gap: 18rpx;
  padding: 28rpx;
  border-radius: 40rpx;
  background: #ffffff;
}

.record-cover {
  width: 132rpx;
  height: 132rpx;
  border-radius: 24rpx;
  background: #eef0f4;
}

.record-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.record-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.title {
  font-size: 28rpx;
  font-weight: 700;
  color: #111111;
}

.status,
.meta,
.reason {
  font-size: 24rpx;
  color: #6e7380;
}

.status {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: #f3f4f8;
  font-weight: 700;
}

.reason {
  line-height: 1.6;
}
</style>
