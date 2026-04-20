<script setup lang="ts">
import { ref, watch } from 'vue';
import { searchRegions, type FlatRegion } from '../../utils/region-data';

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ (e: 'update:modelValue', val: string): void }>();

const keyword = ref(props.modelValue || '');
const results = ref<FlatRegion[]>([]);
const showDropdown = ref(false);

watch(() => props.modelValue, (val) => {
  keyword.value = val || '';
});

function onInput(e: any) {
  keyword.value = e.detail.value;
  results.value = searchRegions(keyword.value);
  showDropdown.value = results.value.length > 0;
}

function select(item: FlatRegion) {
  keyword.value = item.label;
  emit('update:modelValue', item.label);
  showDropdown.value = false;
  results.value = [];
}

function onBlur() {
  // 延迟关闭，让 tap 事件先触发
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
}
</script>

<template>
  <view class="region-picker">
    <input
      class="field"
      :value="keyword"
      placeholder="省市区（输入关键词搜索）"
      @input="onInput"
      @blur="onBlur"
      @focus="() => { if (keyword) { results = searchRegions(keyword); showDropdown = results.length > 0; } }"
    />
    <view v-if="showDropdown" class="dropdown">
      <view
        v-for="item in results"
        :key="item.label"
        class="dropdown-item"
        @tap="select(item)"
      >
        <text class="item-label">{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.region-picker {
  position: relative;
  margin-bottom: 16rpx;
}

.field {
  width: auto;
  height: 92rpx;
  padding: 0 24rpx;
  border-radius: 24rpx;
  background: #f7f7fa;
  font-size: 24rpx;
}

.dropdown {
  position: absolute;
  top: 100rpx;
  left: 0;
  right: 0;
  z-index: 100;
  background: #ffffff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
  max-height: 480rpx;
  overflow-y: auto;
}

.dropdown-item {
  padding: 24rpx 28rpx;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: #f7f7fa;
  }
}

.item-label {
  font-size: 26rpx;
  color: #17181c;
}
</style>
