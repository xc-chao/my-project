<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string;
    back?: boolean;
    darkAction?: string;
    actionPath?: string;
  }>(),
  {
    back: false,
    darkAction: '',
    actionPath: ''
  }
);

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
  <view class="header-wrap">
    <view class="status-row">
      <text class="status-time">9:41</text>
      <text class="status-signal">5G 100%</text>
    </view>
    <view class="nav-row">
      <view class="nav-btn" @tap="props.back ? handleBack() : undefined">
        <text v-if="props.back" class="nav-btn-text">&lt;</text>
      </view>
      <text class="nav-title">{{ props.title }}</text>
      <view :class="['nav-btn', { dark: props.darkAction }]" @tap="handleAction">
        <text class="nav-btn-text">{{ props.darkAction }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.header-wrap {
  padding: 0 20rpx;
}

.status-row,
.nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-row {
  height: 62px;
}

.status-time {
  font-size: 30rpx;
  font-weight: 700;
}

.status-signal {
  font-size: 24rpx;
  font-weight: 600;
}

.nav-row {
  height: 108rpx;
}

.nav-btn {
  width: 80rpx;
  height: 80rpx;
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
  font-size: 56rpx;
  font-weight: 700;
  color: #111111;
}
</style>
