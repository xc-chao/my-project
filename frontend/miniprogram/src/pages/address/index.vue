<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import AppHeader from '../../components/AppHeader.vue';
import AddressCard from '../../components/common/AddressCard.vue';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import FormSection from '../../components/common/FormSection.vue';
import { pageImageMap } from '../../mock/page-image-map';
import {
  createAddress,
  deleteAddress,
  getAddressList,
  updateAddress,
  type AddressItem
} from '../../services/addressService';

const list = ref<AddressItem[]>([]);
const editingId = ref('');
const form = reactive({
  name: '',
  phone: '',
  region: '',
  detail: '',
  isDefault: true
});

const submitLabel = computed(() => (editingId.value ? '保存地址' : '新增地址'));
const defaultAddress = computed(() => list.value.find((item) => item.isDefault) || list.value[0] || null);

function fillForm(item?: AddressItem) {
  form.name = item?.name || '';
  form.phone = item?.phone || '';
  form.region = item?.region || '';
  form.detail = item?.detail || '';
  form.isDefault = item?.isDefault ?? true;
}

async function loadList() {
  list.value = await getAddressList();
}

async function handleSubmit() {
  if (!form.name || !form.phone || !form.region || !form.detail) {
    uni.showToast({
      title: '请完善地址信息',
      icon: 'none'
    });
    return;
  }

  if (editingId.value) {
    list.value = await updateAddress(editingId.value, form);
  } else {
    list.value = await createAddress(form);
  }

  editingId.value = '';
  fillForm();
}

function handleEdit(id: string) {
  const target = list.value.find((item) => item.id === id);
  editingId.value = id;
  fillForm(target);
}

async function handleDelete(id: string) {
  list.value = await deleteAddress(id);

  if (editingId.value === id) {
    editingId.value = '';
    fillForm();
  }
}

onMounted(async () => {
  await loadList();
  fillForm(list.value.find((item) => item.isDefault) || list.value[0]);
});
</script>

<template>
  <view class="page-shell">
    <AppHeader title="地址管理" back />

    <scroll-view scroll-y class="body">
      <view class="hero-card">
        <view class="hero-copy">
          <text class="hero-title">地址与配送偏好</text>
          <text class="hero-desc">默认地址会自动带入确认订单，也方便后续统一查看与修改。</text>
        </view>
      </view>

      <view v-if="defaultAddress" class="default-card">
        <text class="default-label">默认地址</text>
        <text class="default-name">{{ defaultAddress.name }} {{ defaultAddress.phone }}</text>
        <text class="default-detail">{{ defaultAddress.region }} {{ defaultAddress.detail }}</text>
      </view>

      <view v-if="list.length" class="card-list">
        <AddressCard
          v-for="item in list"
          :key="item.id"
          :item="item"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </view>

      <EmptyStateCard
        v-else
        title="还没有地址"
        desc="新增一个常用收货地址后，确认订单页会自动带入默认地址。"
      />

      <FormSection title="编辑地址" desc="支持新增、修改和设置默认地址">
        <input v-model="form.name" class="field" placeholder="收货人姓名" />
        <input v-model="form.phone" class="field" placeholder="联系电话" />
        <input v-model="form.region" class="field" placeholder="省市区" />
        <textarea v-model="form.detail" class="field textarea" placeholder="详细地址" />
        <view class="toggle-row" @tap="form.isDefault = !form.isDefault">
          <text class="toggle-label">设为默认地址</text>
          <view :class="['toggle', { active: form.isDefault }]">
            <view class="dot" />
          </view>
        </view>
        <view class="submit-btn" @tap="handleSubmit">
          <text>{{ submitLabel }}</text>
        </view>
      </FormSection>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.body {
  height: calc(100vh - 180rpx);
  padding: 8rpx 40rpx 40rpx;
}

.hero-card,
.default-card {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 24rpx;
  border-radius: 40rpx;
  background: #ffffff;
}

.default-card {
  margin-top: 20rpx;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.hero-title,
.default-name {
  font-size: 30rpx;
  font-weight: 700;
  color: #111111;
}

.hero-desc,
.default-detail,
.default-label {
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

.card-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 20rpx;
}

.field {
  width: 100%;
  height: 92rpx;
  padding: 0 24rpx;
  border-radius: 24rpx;
  background: #f7f7fa;
  font-size: 24rpx;
}

.textarea {
  min-height: 160rpx;
  padding: 24rpx;
}

.toggle-row,
.toggle,
.dot {
  display: flex;
  align-items: center;
}

.toggle-row {
  justify-content: space-between;
}

.toggle-label {
  font-size: 24rpx;
  color: #6e7380;
}

.toggle {
  width: 96rpx;
  height: 56rpx;
  padding: 6rpx;
  border-radius: 999rpx;
  background: #d6dae3;
  justify-content: flex-start;
}

.toggle.active {
  background: #17181c;
  justify-content: flex-end;
}

.dot {
  width: 44rpx;
  height: 44rpx;
  border-radius: 22rpx;
  background: #ffffff;
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
</style>
