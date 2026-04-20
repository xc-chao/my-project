<script setup lang="ts">
import { reactive, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import FormSection from '../../components/common/FormSection.vue';
import { submitFeedback } from '../../services/feedbackService';

const submitting = ref(false);
const productId = ref('');
const productTitle = ref('');
const summary = ref('');

async function handleSubmit() {
  if (!productId.value) {
    uni.showToast({ title: '商品信息缺失，请重新进入', icon: 'none' });
    return;
  }

  if (!summary.value.trim()) {
    uni.showToast({ title: '请填写评价内容', icon: 'none' });
    return;
  }

  submitting.value = true;

  try {
    await submitFeedback({
      productId: productId.value,
      productTitle: productTitle.value,
      summary: summary.value.trim()
    });

    uni.showToast({ title: '评价已提交', icon: 'success' });

    setTimeout(() => {
      if (getCurrentPages().length > 1) {
        uni.navigateBack();
      }
    }, 1200);
  } catch (error) {
    const message = error instanceof Error ? error.message : '提交失败，请稍后重试';
    uni.showToast({ title: message, icon: 'none' });
  } finally {
    submitting.value = false;
  }
}

onLoad((query) => {
  if (typeof query?.productId === 'string') {
    productId.value = query.productId;
  }
  if (typeof query?.productTitle === 'string') {
    productTitle.value = decodeURIComponent(query.productTitle);
  }
});
</script>

<template>
  <view class="page-shell">
    <AppHeader title="写评价" back />

    <scroll-view scroll-y class="body">
      <view class="hero-card">
        <text class="hero-title">{{ productTitle || '商品评价' }}</text>
        <text class="hero-desc">分享你的真实体验，帮助其他用户做出更好的选择。</text>
      </view>

      <FormSection title="评价内容" desc="最多 500 字">
        <textarea
          v-model="summary"
          class="field textarea"
          placeholder="说说这件商品的尺码、质量、物流体验等..."
          maxlength="500"
        />
        <text class="char-count">{{ summary.length }}/500</text>
        <view :class="['submit-btn', { disabled: submitting }]" @tap="handleSubmit">
          <text>{{ submitting ? '提交中...' : '提交评价' }}</text>
        </view>
      </FormSection>
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
  padding: 28rpx;
  border-radius: 40rpx;
  margin-bottom: 20px;
  background: #ffffff;
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

.field {
  width: auto;
  padding: 10rpx;
  border-radius: 24rpx;
  background: #f7f7fa;
  font-size: 24rpx;
  margin-bottom: 12rpx;
}

.textarea {
  min-height: 280rpx;
}

.char-count {
  font-size: 22rpx;
  color: #9aa0aa;
  text-align: right;
  display: block;
  margin-bottom: 20rpx;
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

.submit-btn.disabled {
  opacity: 0.6;
}
</style>
