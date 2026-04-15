<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import FormSection from '../../components/common/FormSection.vue';
import { assetCatalog, pageImageMap } from '../../constants/page-image-map';
import { useUserStore } from '../../store';
import type { UserRole } from '../../types/domain';

const userStore = useUserStore();
const saving = ref(false);
const choosingAvatar = ref(false);
const heroImage = pageImageMap.profile.banner;
const avatarOptions = assetCatalog.avatars.featured.slice(0, 8);
const roleOptions: Array<{ key: UserRole; label: string; desc: string }> = [
  {
    key: 'user',
    label: '普通用户',
    desc: '浏览商品、下单、售后与 AI 咨询'
  },
  {
    key: 'admin',
    label: '管理员',
    desc: '额外开放后台信息管理与运营看板'
  }
];
const form = reactive<{
  nickname: string;
  avatar: string;
  role: UserRole;
}>({
  nickname: '',
  avatar: pageImageMap.profile.avatar,
  role: 'user'
});

const profile = computed(() => userStore.profile);
const currentRoleDesc = computed(() => {
  return form.role === 'admin' ? '已开启后台管理权限入口' : '当前为普通用户消费视角';
});
const isAlbumAvatar = computed(() => !avatarOptions.includes(form.avatar));

function syncForm() {
  if (!userStore.profile) {
    return;
  }

  form.nickname = userStore.profile.nickname;
  form.avatar = userStore.profile.avatar || pageImageMap.profile.avatar;
  form.role = userStore.profile.role;
}

function ensureLoginAccess() {
  if (userStore.profile) {
    syncForm();
    return true;
  }

  return false;
}

function goLogin() {
  uni.navigateTo({
    url: '/pages/auth/login'
  });
}

function chooseImageFromAlbum() {
  return new Promise<UniApp.ChooseImageSuccessCallbackResult>((resolve, reject) => {
    uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (result) => resolve(result),
      fail: (error) => reject(error)
    });
  });
}

async function handleChooseAlbumAvatar() {
  choosingAvatar.value = true;

  try {
    const result = await chooseImageFromAlbum();
    const nextAvatar = result.tempFilePaths?.[0];

    if (!nextAvatar) {
      uni.showToast({
        title: '未选择图片',
        icon: 'none'
      });
      return;
    }

    form.avatar = nextAvatar;
    uni.showToast({
      title: '已选择新头像，记得保存',
      icon: 'none'
    });
  } catch (error) {
    const errorMessage =
      error && typeof error === 'object' && 'errMsg' in error ? String(error.errMsg || '') : '';

    if (errorMessage.toLowerCase().includes('cancel')) {
      return;
    }

    uni.showToast({
      title: '头像选择失败',
      icon: 'none'
    });
  } finally {
    choosingAvatar.value = false;
  }
}

async function handleSave() {
  const nickname = form.nickname.trim();

  if (!nickname) {
    uni.showToast({
      title: '请输入昵称',
      icon: 'none'
    });
    return;
  }

  saving.value = true;

  try {
    await userStore.updateProfile({
      nickname,
      avatar: form.avatar,
      role: form.role
    });
    uni.showToast({
      title: '资料已保存',
      icon: 'none'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '资料保存失败';
    uni.showToast({
      title: message,
      icon: 'none'
    });
  } finally {
    saving.value = false;
  }
}

async function handleLogout() {
  saving.value = true;

  try {
    await userStore.logout();
    uni.showToast({
      title: '已退出登录',
      icon: 'none'
    });
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/profile/index'
      });
    }, 240);
  } catch (error) {
    const message = error instanceof Error ? error.message : '退出登录失败';
    uni.showToast({
      title: message,
      icon: 'none'
    });
  } finally {
    saving.value = false;
  }
}

if (userStore.profile) {
  syncForm();
}

onShow(() => {
  ensureLoginAccess();
});
</script>

<template>
  <view class="page-shell">
    <AppHeader title="个人信息管理" back />

    <scroll-view scroll-y class="page-scroll">
      <view class="body" v-if="profile">
        <view class="hero-card">
          <image class="hero-cover" :src="heroImage" mode="aspectFill" />
          <view class="hero-meta">
            <image class="hero-avatar" :src="form.avatar" mode="aspectFill" />
            <view class="hero-copy">
              <text class="hero-name">{{ form.nickname }}</text>
              <text class="hero-phone">{{ profile.phone }}</text>
              <text class="hero-role">{{ currentRoleDesc }}</text>
            </view>
          </view>
        </view>

        <FormSection title="基础资料" desc="昵称会同步展示在“我的”页顶部信息卡。">
          <view class="field-block">
            <text class="field-label">昵称</text>
            <input
              v-model="form.nickname"
              class="field-input"
              maxlength="20"
              placeholder="请输入昵称"
              placeholder-class="field-placeholder"
            />
          </view>
          <view class="field-block readonly">
            <text class="field-label">手机号</text>
            <text class="field-value">{{ profile.phone }}</text>
          </view>
        </FormSection>

        <FormSection title="身份切换" desc="当前项目为演示环境，可切换身份验证不同页面权限。">
          <view class="role-list">
            <view
              v-for="item in roleOptions"
              :key="item.key"
              :class="['role-card', { active: form.role === item.key }]"
              @tap="form.role = item.key"
            >
              <view class="role-card-head">
                <text class="role-title">{{ item.label }}</text>
                <text class="role-tag">{{ form.role === item.key ? '当前' : '切换' }}</text>
              </view>
              <text class="role-desc">{{ item.desc }}</text>
            </view>
          </view>
        </FormSection>

        <FormSection title="头像选择" desc="支持本地素材选择，也支持从系统相册更换头像。">
          <view class="avatar-toolbar">
            <view class="avatar-toolbar-copy">
              <text class="avatar-toolbar-title">当前头像来源</text>
              <text class="avatar-toolbar-desc">{{ isAlbumAvatar ? '来自系统相册' : '来自本地素材库' }}</text>
            </view>
            <button class="upload-avatar-btn" :loading="choosingAvatar" @tap="handleChooseAlbumAvatar">
              从相册上传
            </button>
          </view>
          <view class="avatar-grid">
            <view
              v-for="item in avatarOptions"
              :key="item"
              :class="['avatar-option', { active: form.avatar === item }]"
              @tap="form.avatar = item"
            >
              <image class="avatar-option-image" :src="item" mode="aspectFill" />
            </view>
          </view>
        </FormSection>

        <FormSection title="账号操作" desc="保存会同步当前登录态，退出后会回到“我的”页未登录状态。">
          <view class="action-group">
            <button class="save-btn" :loading="saving || userStore.loading" @tap="handleSave">保存资料</button>
            <button class="logout-btn" :disabled="saving || userStore.loading" @tap="handleLogout">
              退出当前登录
            </button>
          </view>
        </FormSection>
      </view>

      <view v-else class="body">
        <EmptyStateCard
          title="当前未登录"
          desc="登录后可管理头像、昵称、演示身份以及退出当前账号。"
          action-text="去登录"
          @action="goLogin"
        />
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.page-scroll {
  height: calc(100vh - 120rpx);
}

.body {
  padding: 8rpx 40rpx 40rpx;
}

.hero-card {
  overflow: hidden;
  margin-bottom: 20rpx;
  border-radius: 40rpx;
  background: #ffffff;
}

.hero-cover {
  width: 100%;
  height: 260rpx;
  background: #eef0f4;
}

.hero-meta {
  padding: 0 28rpx 28rpx;
  margin-top: -64rpx;
  display: flex;
  align-items: flex-end;
  gap: 20rpx;
}

.hero-avatar {
  width: 136rpx;
  height: 136rpx;
  border-radius: 50%;
  border: 6rpx solid #ffffff;
  background: #eef0f4;
  flex-shrink: 0;
}

.hero-copy {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.hero-name {
  font-size: 34rpx;
  font-weight: 700;
  color: #111111;
}

.hero-phone,
.hero-role,
.role-desc,
.field-label,
.field-value {
  font-size: 24rpx;
  line-height: 1.6;
  color: #6e7380;
}

.field-block {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  margin-top: 18rpx;
}

.field-block.readonly {
  padding: 22rpx 24rpx;
  border-radius: 28rpx;
  background: #f7f7fa;
}

.field-input {
  height: 92rpx;
  padding: 0 24rpx;
  border-radius: 28rpx;
  background: #f7f7fa;
  font-size: 28rpx;
  color: #111111;
}

.field-placeholder {
  color: #a1a7b3;
}

.role-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 18rpx;
}

.role-card {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 24rpx;
  border: 2rpx solid transparent;
  border-radius: 28rpx;
  background: #f7f7fa;
}

.role-card.active {
  border-color: rgba(23, 24, 28, 0.14);
  background: linear-gradient(135deg, #17181c 0%, #2a2d35 100%);
}

.role-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.role-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #111111;
}

.role-tag {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: rgba(23, 24, 28, 0.08);
  font-size: 20rpx;
  font-weight: 700;
  color: #17181c;
}

.role-card.active .role-title,
.role-card.active .role-desc,
.role-card.active .role-tag {
  color: #ffffff;
}

.role-card.active .role-tag {
  background: rgba(255, 255, 255, 0.18);
}

.avatar-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 18rpx;
  margin-top: 18rpx;
}

.avatar-toolbar {
  margin-top: 18rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.avatar-toolbar-copy {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.avatar-toolbar-title {
  font-size: 24rpx;
  font-weight: 700;
  color: #111111;
}

.avatar-toolbar-desc {
  font-size: 22rpx;
  color: #8c93a1;
}

.upload-avatar-btn {
  min-width: 188rpx;
  height: 80rpx;
  padding: 0 24rpx;
  border-radius: 999rpx;
  background: #17181c;
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 700;
  line-height: 80rpx;
}

.avatar-option {
  width: calc(25% - 14rpx);
  padding: 8rpx;
  border: 3rpx solid transparent;
  border-radius: 28rpx;
  background: #f7f7fa;
}

.avatar-option.active {
  border-color: #17181c;
}

.avatar-option-image {
  width: 100%;
  height: 144rpx;
  border-radius: 22rpx;
  background: #eef0f4;
}

.action-group {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 18rpx;
}

.save-btn,
.logout-btn {
  width: 100%;
  height: 96rpx;
  border-radius: 999rpx;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 96rpx;
}

.save-btn {
  color: #ffffff;
  background: #17181c;
}

.logout-btn {
  color: #111111;
  background: #ffffff;
  border: 1px solid #e2e5eb;
}
</style>
