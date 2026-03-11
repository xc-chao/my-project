<script setup lang="ts">
const props = defineProps<{
  modelValue: number;
  min?: number;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void;
}>();

function update(next: number) {
  emit('update:modelValue', Math.max(props.min || 1, next));
}
</script>

<template>
  <view class="stepper">
    <view class="btn" @tap="update(modelValue - 1)">
      <text>-</text>
    </view>
    <text class="value">{{ modelValue }}</text>
    <view class="btn" @tap="update(modelValue + 1)">
      <text>+</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.stepper {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.btn {
  width: 68rpx;
  height: 68rpx;
  border-radius: 34rpx;
  background: #f3f4f8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111111;
  font-size: 28rpx;
  font-weight: 700;
}

.value {
  min-width: 40rpx;
  text-align: center;
  font-size: 28rpx;
  font-weight: 700;
  color: #111111;
}
</style>
