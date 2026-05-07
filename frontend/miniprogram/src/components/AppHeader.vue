<script setup lang="ts">
import UniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';

const props = withDefaults(
  defineProps<{
    title: string;
    back?: boolean;
    darkAction?: string;
    actionPath?: string;
    visible?: boolean;
  }>(),
  {
    back: false,
    darkAction: '',
    actionPath: '',
    visible: true
  }
);

const statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0;

function handleBack() {
  if (getCurrentPages().length > 1) {
    uni.navigateBack();
    return;
  }

  uni.switchTab({
    url: '/pages/home/index'
  });
}

function handleAction() {
  if (!props.actionPath) {
    return;
  }

  uni.navigateTo({
    url: props.actionPath
  });
}
</script>

<template>
  <view v-if="props.visible" class="header-wrap" :style="{ paddingTop: `${statusBarHeight}px` }">
    <view class="nav-row">
      <view v-if="props.back" class="nav-btn" @tap="handleBack">
        <UniIcons type="left" :size="18" color="#111111" />
      </view>
      <view v-else class="nav-spacer" />

      <text class="nav-title">{{ props.title }}</text>

      <view v-if="props.darkAction || props.actionPath" :class="['nav-btn', { dark: props.darkAction }]" @tap="handleAction">
        <text class="nav-btn-text">{{ props.darkAction }}</text>
      </view>
      <view v-else class="nav-spacer" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.header-wrap {
  padding: 0 20rpx;
}

.nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 108rpx;
}

.nav-btn,
.nav-spacer {
  width: 80rpx;
  height: 80rpx;
  flex-shrink: 0;
}

.nav-btn {
  border-radius: 40rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn.dark {
  background: #17181c;
}

.nav-btn-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #111111;
}

.nav-btn.dark .nav-btn-text {
  color: #ffffff;
}

.nav-title {
  min-width: 0;
  flex: 1;
  font-size: 34rpx;
  font-weight: 700;
  color: #111111;
  text-align: center;
}
</style>
