<script setup lang="ts">
defineProps<{
  item: {
    id: string;
    name: string;
    phone: string;
    region: string;
    detail: string;
    isDefault: boolean;
  };
  compact?: boolean;
}>();

const emit = defineEmits<{
  (event: 'edit', id: string): void;
  (event: 'delete', id: string): void;
}>();
</script>

<template>
  <view class="card">
    <view class="top-row">
      <view class="meta">
        <text class="name">{{ item.name }}</text>
        <text class="phone">{{ item.phone }}</text>
        <text v-if="item.isDefault" class="tag">默认</text>
      </view>
      <view v-if="!compact" class="actions">
        <text class="action-text" @tap="emit('edit', item.id)">编辑</text>
        <text class="action-text danger" @tap="emit('delete', item.id)">删除</text>
      </view>
    </view>
    <text class="detail">{{ item.region }} {{ item.detail }}</text>
  </view>
</template>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  padding: 28rpx;
  border-radius: 40rpx;
  background: #ffffff;
}

.top-row,
.meta,
.actions {
  display: flex;
  align-items: center;
}

.top-row {
  justify-content: space-between;
  gap: 20rpx;
}

.meta {
  gap: 14rpx;
  flex-wrap: wrap;
}

.name {
  font-size: 28rpx;
  font-weight: 700;
  color: #111111;
}

.phone,
.detail,
.action-text {
  font-size: 24rpx;
  color: #6e7380;
}

.detail {
  line-height: 1.6;
}

.tag {
  padding: 6rpx 14rpx;
  border-radius: 999rpx;
  background: #17181c;
  color: #ffffff;
  font-size: 20rpx;
  font-weight: 700;
}

.actions {
  gap: 18rpx;
}

.danger {
  color: #e94b45;
}
</style>
