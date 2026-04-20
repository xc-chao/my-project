<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import FormSection from '../../components/common/FormSection.vue';
import type { ProductItem } from '../../types/domain';
import {
  createAdminProduct,
  getAdminProductDetail,
  updateAdminProduct,
  type AdminProductPayload
} from '../../services/adminService';
import { useUserStore } from '../../store';
import { ensureAdminPageAccess } from '../../utils/admin';

const userStore = useUserStore();
const editingId = ref('');
const loading = ref(false);
const saving = ref(false);
const choosingCover = ref(false);
const choosingGallery = ref(false);
const draggingGalleryId = ref('');
const dragGalleryX = ref(0);
const dragGalleryY = ref(0);
const currentSales = ref(0);
const galleryColumns = 3;
const galleryGapPx = uni.upx2px(14);
const galleryThumbHeightPx = uni.upx2px(132);
const galleryContainerPaddingPx = uni.upx2px(40 * 2 + 28 * 2);
const galleryThumbWidthPx = Math.max(
  Math.floor((uni.getSystemInfoSync().windowWidth - galleryContainerPaddingPx - galleryGapPx * (galleryColumns - 1)) / galleryColumns),
  72
);
const galleryStepX = galleryThumbWidthPx + galleryGapPx;
const galleryStepY = galleryThumbHeightPx + galleryGapPx;
const categories = ['鞋靴', '服饰', '配件'];
const saleStatusOptions: Array<{ key: AdminProductPayload['saleStatus']; label: string }> = [
  { key: 'on_sale', label: '在售' },
  { key: 'off_shelf', label: '下架' }
];
const MAX_GALLERY = 6;

const form = reactive({
  title: '',
  subtitle: '',
  category: '鞋靴',
  price: '',
  originalPrice: '',
  stock: '',
  cover: '',
  badgesText: '',
  sizesText: '',
  detail: '',
  galleryText: '',
  saleStatus: 'on_sale' as AdminProductPayload['saleStatus']
});

const pageTitle = computed(() => (editingId.value ? '编辑商品' : '新增商品'));
const submitLabel = computed(() => (editingId.value ? '保存商品' : '新增商品'));
const galleryPreview = computed(() => {
  return parseList(form.galleryText).map((item, index) => ({
    id: `${index}-${item}`,
    url: item,
    index
  }));
});
const gallerySortAreaHeight = computed(() => {
  const rows = Math.max(Math.ceil(galleryPreview.value.length / galleryColumns), 1);
  return rows * galleryThumbHeightPx + Math.max(rows - 1, 0) * galleryGapPx;
});

function parseList(value: string) {
  return value
    .split(/[\n,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function setGalleryList(list: string[]) {
  form.galleryText = list
    .map((item) => item.trim())
    .filter(Boolean)
    .join('\n');
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getGallerySlot(index: number) {
  return {
    x: (index % galleryColumns) * galleryStepX,
    y: Math.floor(index / galleryColumns) * galleryStepY
  };
}

function getGalleryItemPosition(index: number, itemId: string) {
  if (draggingGalleryId.value === itemId) {
    return {
      x: dragGalleryX.value,
      y: dragGalleryY.value
    };
  }

  return getGallerySlot(index);
}

function getGalleryTargetIndex(x: number, y: number, total: number) {
  const maxRow = Math.max(Math.ceil(total / galleryColumns) - 1, 0);
  const col = clamp(Math.round(x / galleryStepX), 0, galleryColumns - 1);
  const row = clamp(Math.round(y / galleryStepY), 0, maxRow);

  return Math.min(row * galleryColumns + col, total - 1);
}

function resetGalleryDrag() {
  draggingGalleryId.value = '';
  dragGalleryX.value = 0;
  dragGalleryY.value = 0;
}

function fillForm(item?: ProductItem) {
  form.title = item?.title || '';
  form.subtitle = item?.subtitle || '';
  form.category = item?.category || '鞋靴';
  form.price = item ? String(item.price) : '';
  form.originalPrice = item ? String(item.originalPrice) : '';
  form.stock = item ? String(item.stock) : '';
  form.cover = item?.cover || '';
  form.badgesText = item?.badges?.join('，') || '';
  form.sizesText = item?.sizes?.join('，') || '';
  form.detail = item?.detail || '';
  form.galleryText = item?.gallery?.length ? item.gallery.join('\n') : '';
  form.saleStatus = item?.saleStatus || 'on_sale';
  currentSales.value = item?.sales || 0;
}

async function loadDetail(id: string) {
  if (!ensureAdminPageAccess(userStore.isAdmin)) {
    return;
  }

  loading.value = true;

  try {
    const result = await getAdminProductDetail(id);
    fillForm(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : '商品详情加载失败';
    uni.showToast({
      title: message,
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
}

function showConfirmModal(title: string, content: string) {
  return new Promise<UniApp.ShowModalRes>((resolve, reject) => {
    uni.showModal({
      title,
      content,
      success: (result) => resolve(result),
      fail: (error) => reject(error)
    });
  });
}

async function maybeSyncCoverToGallery(nextCover: string) {
  const current = parseList(form.galleryText);

  if (!current.length || current[0] === nextCover) {
    return;
  }

  const result = await showConfirmModal('同步图集首图', '封面已变更，是否将图集第一张同步为新的封面图？');

  if (result.confirm) {
    const rest = current.filter((item, index) => index !== 0 && item !== nextCover);
    setGalleryList([nextCover, ...rest]);
  }
}

function isChooseImageCanceled(error: unknown) {
  return (
    !!error &&
    typeof error === 'object' &&
    'errMsg' in error &&
    String(error.errMsg || '')
      .toLowerCase()
      .includes('cancel')
  );
}

function chooseImagesFromAlbum(count: number) {
  return new Promise<string[]>((resolve, reject) => {
    uni.chooseImage({
      count,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (result) => {
        const paths = Array.isArray(result.tempFilePaths)
          ? result.tempFilePaths
          : result.tempFilePaths
            ? [result.tempFilePaths]
            : [];

        resolve(paths);
      },
      fail: (error) => reject(error)
    });
  });
}

function appendGalleryImages(images: string[]) {
  const next = parseList(form.galleryText);

  for (const image of images) {
    const normalized = image.trim();
    if (normalized && !next.includes(normalized)) {
      next.push(normalized);
    }
    if (next.length >= MAX_GALLERY) break;
  }

  setGalleryList(next);
}

function removeGalleryImage(index: number) {
  const next = parseList(form.galleryText);
  next.splice(index, 1);
  setGalleryList(next);

  if (!next.length) {
    resetGalleryDrag();
  }
}

function startGalleryDrag(itemId: string, index: number) {
  draggingGalleryId.value = itemId;
  const slot = getGallerySlot(index);
  dragGalleryX.value = slot.x;
  dragGalleryY.value = slot.y;
}

function handleGalleryDragChange(
  itemId: string,
  event: { detail?: { x?: number; y?: number; source?: string } }
) {
  if (draggingGalleryId.value !== itemId) {
    return;
  }

  const detail = event.detail;

  if (!detail) {
    return;
  }

  dragGalleryX.value = detail.x || 0;
  dragGalleryY.value = detail.y || 0;
}

function finishGalleryDrag(itemId: string) {
  if (draggingGalleryId.value !== itemId) {
    return;
  }

  const preview = galleryPreview.value;
  const fromIndex = preview.findIndex((item) => item.id === itemId);

  if (fromIndex < 0) {
    resetGalleryDrag();
    return;
  }

  const toIndex = getGalleryTargetIndex(dragGalleryX.value, dragGalleryY.value, preview.length);

  if (toIndex !== fromIndex) {
    const next = parseList(form.galleryText);
    const [moved] = next.splice(fromIndex, 1);

    if (moved) {
      next.splice(toIndex, 0, moved);
      setGalleryList(next);
    }
  }

  resetGalleryDrag();
}

async function chooseCoverFromAlbum() {
  if (choosingCover.value) {
    return;
  }

  choosingCover.value = true;

  try {
    const [image] = await chooseImagesFromAlbum(1);

    if (!image) {
      return;
    }

    form.cover = image;
    await maybeSyncCoverToGallery(image);
    uni.showToast({
      title: '封面已更新，记得保存',
      icon: 'none'
    });
  } catch (error) {
    if (!isChooseImageCanceled(error)) {
      uni.showToast({
        title: '封面选择失败',
        icon: 'none'
      });
    }
  } finally {
    choosingCover.value = false;
  }
}

async function chooseGalleryFromAlbum() {
  if (choosingGallery.value) {
    return;
  }

  const current = parseList(form.galleryText);
  const remaining = MAX_GALLERY - current.length;

  if (remaining <= 0) {
    uni.showToast({ title: `最多上传 ${MAX_GALLERY} 张图`, icon: 'none' });
    return;
  }

  choosingGallery.value = true;

  try {
    const images = await chooseImagesFromAlbum(remaining);

    if (!images.length) {
      return;
    }

    appendGalleryImages(images);
    uni.showToast({ title: `已追加 ${images.length} 张图`, icon: 'none' });
  } catch (error) {
    if (!isChooseImageCanceled(error)) {
      uni.showToast({ title: '图集选择失败', icon: 'none' });
    }
  } finally {
    choosingGallery.value = false;
  }
}

function buildPayload() {
  const title = form.title.trim();
  const subtitle = form.subtitle.trim();
  const detail = form.detail.trim();
  const category = form.category.trim();
  const cover = form.cover.trim();
  const badges = parseList(form.badgesText);
  const sizes = parseList(form.sizesText);
  const gallery = parseList(form.galleryText);
  const price = Number(form.price);
  const originalPrice = Number(form.originalPrice);
  const stock = Number(form.stock);

  if (!title || !subtitle || !detail || !category || !cover) {
    uni.showToast({
      title: '请完善商品基础信息',
      icon: 'none'
    });
    return null;
  }

  if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(originalPrice) || originalPrice <= 0) {
    uni.showToast({
      title: '请填写正确的价格',
      icon: 'none'
    });
    return null;
  }

  if (!Number.isInteger(stock) || stock < 0) {
    uni.showToast({
      title: '库存必须是非负整数',
      icon: 'none'
    });
    return null;
  }

  if (!sizes.length) {
    uni.showToast({
      title: '请至少填写一个尺码/规格',
      icon: 'none'
    });
    return null;
  }

  return {
    title,
    subtitle,
    category,
    price,
    originalPrice,
    stock,
    cover,
    badges: badges.length ? badges : ['后台新增'],
    sizes,
    detail,
    gallery: gallery.length ? gallery : [cover],
    saleStatus: form.saleStatus
  } satisfies AdminProductPayload;
}

function goBackToProducts() {
  if (getCurrentPages().length > 1) {
    uni.navigateBack();
    return;
  }

  uni.redirectTo({
    url: '/pages/admin/products'
  });
}

async function handleSubmit() {
  const payload = buildPayload();

  if (!payload) {
    return;
  }

  saving.value = true;

  try {
    if (editingId.value) {
      await updateAdminProduct(editingId.value, payload);
    } else {
      await createAdminProduct(payload);
    }

    uni.showToast({
      title: editingId.value ? '商品已保存' : '商品已新增',
      icon: 'success'
    });

    setTimeout(() => {
      goBackToProducts();
    }, 260);
  } catch (error) {
    const message = error instanceof Error ? error.message : '商品保存失败';
    uni.showToast({
      title: message,
      icon: 'none'
    });
  } finally {
    saving.value = false;
  }
}

onLoad((query) => {
  if (!ensureAdminPageAccess(userStore.isAdmin)) {
    return;
  }

  if (typeof query?.id === 'string' && query.id) {
    editingId.value = query.id;
    loadDetail(query.id);
    return;
  }

  fillForm();
});
</script>

<template>
  <view class="page-shell">
    <AppHeader :title="pageTitle" back />

    <scroll-view scroll-y class="body">
      <view class="hero-card">
        <view class="hero-copy">
          <text class="hero-title">{{ pageTitle }}</text>
          <text class="hero-desc">支持新增商品和修改展示字段，保存后会同步回后台商品管理列表。</text>
        </view>
        <view class="hero-meta" v-if="editingId">
          <text class="meta-pill">ID {{ editingId }}</text>
          <text class="meta-pill">销量 {{ currentSales }}</text>
        </view>
      </view>

      <FormSection title="基础信息" desc="先确定商品标题、副标题和所属分类">
        <input v-model="form.title" class="field" placeholder="商品标题" />
        <input v-model="form.subtitle" class="field" placeholder="商品副标题" />
        <view class="pill-row">
          <view
            v-for="item in categories"
            :key="item"
            :class="['option-pill', { active: form.category === item }]"
            @tap="form.category = item"
          >
            <text>{{ item }}</text>
          </view>
        </view>
      </FormSection>

      <FormSection title="销售信息" desc="配置价格、库存和上架状态">
        <view class="field-grid">
          <input v-model="form.price" class="field" type="digit" placeholder="售价" />
          <input v-model="form.originalPrice" class="field" type="digit" placeholder="原价" />
        </view>
        <input v-model="form.stock" class="field" type="number" placeholder="库存" />
        <view class="pill-row">
          <view
            v-for="item in saleStatusOptions"
            :key="item.key"
            :class="['option-pill', { active: form.saleStatus === item.key }]"
            @tap="form.saleStatus = item.key"
          >
            <text>{{ item.label }}</text>
          </view>
        </view>
      </FormSection>

      <FormSection title="展示标签" desc="用中文逗号或换行分隔多个值">
        <input v-model="form.badgesText" class="field" placeholder="标签，如：热门上新，后台精选" />
        <input v-model="form.sizesText" class="field" placeholder="尺码/规格，如：39，40，41 或 标准版" />
      </FormSection>

      <FormSection title="商品说明" desc="填写前台详情页会展示的商品文案">
        <textarea v-model="form.detail" class="field textarea" placeholder="商品说明" />
      </FormSection>

      <FormSection title="封面与图集" desc="从相册选择封面（1张）和图集（最多6张），每张可单独删除">
        <view class="cover-area">
          <image v-if="form.cover" class="preview-image" :src="form.cover" mode="aspectFill" />
          <view v-else class="cover-placeholder">
            <text>暂无封面</text>
          </view>
          <view :class="['ghost-btn', { disabled: choosingCover }]" @tap="chooseCoverFromAlbum">
            <text>{{ choosingCover ? '选择中...' : '从相册选封面' }}</text>
          </view>
        </view>

        <view class="gallery-header">
          <text class="sub-label">图集（{{ galleryPreview.length }}/{{ MAX_GALLERY }}）</text>
          <view
            v-if="galleryPreview.length < MAX_GALLERY"
            :class="['ghost-btn', 'ghost-btn--sm', { disabled: choosingGallery }]"
            @tap="chooseGalleryFromAlbum"
          >
            <text>{{ choosingGallery ? '选择中...' : '+ 从相册添加' }}</text>
          </view>
        </view>

        <view v-if="galleryPreview.length" class="preview-guide">
          <text>拖拽缩略图可调整图集顺序，第一张会优先作为详情首图展示。</text>
        </view>
        <movable-area
          v-if="galleryPreview.length"
          class="preview-sort-area"
          :style="{ height: `${gallerySortAreaHeight}px` }"
        >
          <movable-view
            v-for="(item, index) in galleryPreview"
            :key="`preview-${item.id}`"
            class="preview-drag-item"
            :class="{ dragging: draggingGalleryId === item.id }"
            :style="{ width: `${galleryThumbWidthPx}px`, height: `${galleryThumbHeightPx}px` }"
            direction="all"
            damping="40"
            friction="4"
            :x="getGalleryItemPosition(index, item.id).x"
            :y="getGalleryItemPosition(index, item.id).y"
            @touchstart.stop="startGalleryDrag(item.id, index)"
            @change="handleGalleryDragChange(item.id, $event)"
            @touchend.stop="finishGalleryDrag(item.id)"
            @touchcancel.stop="finishGalleryDrag(item.id)"
          >
            <view class="preview-thumb-wrap">
              <image class="preview-thumb" :src="item.url" mode="aspectFill" />
              <view v-if="index === 0" class="preview-cover-tag">
                <text>首图</text>
              </view>
              <view class="preview-remove" @tap.stop="removeGalleryImage(item.index)">
                <text>删</text>
              </view>
            </view>
          </movable-view>
        </movable-area>

        <view v-else class="gallery-empty">
          <text>暂无图集，点击上方按钮从相册添加</text>
        </view>
      </FormSection>

      <view :class="['submit-btn', { disabled: saving || loading }]" @tap="handleSubmit">
        <text>{{ saving ? '保存中...' : submitLabel }}</text>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.body {
  height: calc(100vh - 180rpx);
  padding: 8rpx 40rpx 40rpx;
}

.hero-card {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  padding: 28rpx;
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
  font-size: 32rpx;
  font-weight: 700;
  color: #111111;
}

.hero-desc,
.sub-label {
  font-size: 24rpx;
  line-height: 1.6;
  color: #6e7380;
}

.hero-meta,
.pill-row,
.field-grid {
  display: flex;
}

.hero-meta,
.pill-row {
  gap: 14rpx;
  flex-wrap: wrap;
}

.pill-row {
  margin-top: 8rpx;
}

.field-grid {
  gap: 16rpx;
}

.field {
  width: auto;
  height: 92rpx;
  padding: 0 24rpx;
  margin-top: 16rpx;
  border-radius: 24rpx;
  background: #f7f7fa;
  font-size: 24rpx;
}

.field-grid .field {
  flex: 1;
  min-width: 0;
}

.textarea {
  min-height: 180rpx;
  padding: 24rpx;
}

.meta-pill,
.option-pill {
  padding: 12rpx 20rpx;
  border-radius: 999rpx;
  background: #f3f4f8;
  color: #6e7380;
  font-size: 22rpx;
  font-weight: 600;
}

.option-pill.active {
  background: #17181c;
  color: #ffffff;
}

.preview-image {
  width: 100%;
  height: 320rpx;
  margin-top: 18rpx;
  border-radius: 28rpx;
  background: #eef0f4;
}

.sub-label {
  display: block;
  margin-top: 18rpx;
}

.preview-thumb {
  border-radius: 24rpx;
  background: #eef0f4;
  width: 100%;
  height: 132rpx;
}

.preview-thumb-wrap {
  width: 100%;
  height: 100%;
  position: relative;
}

.ghost-btn,
.submit-btn {
  height: 84rpx;
  padding: 0 30rpx;
  border-radius: 42rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 700;
}

.ghost-btn {
  min-width: 180rpx;
  background: #f3f4f8;
  color: #111111;
}

.ghost-btn--sm {
  height: 64rpx;
  min-width: 0;
  padding: 0 22rpx;
  font-size: 22rpx;
}

.ghost-btn.disabled {
  opacity: 0.6;
}

.cover-area {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 8rpx;
}

.gallery-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24rpx;
}

.gallery-empty {
  margin-top: 16rpx;
  padding: 32rpx;
  border-radius: 24rpx;
  background: #f7f7fa;
  text-align: center;
  font-size: 24rpx;
  color: #9aa0aa;
}

.cover-placeholder {
  width: 100%;
  height: 320rpx;
  border-radius: 28rpx;
  background: #f3f4f8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #9aa0aa;
}

.preview-guide {
  margin-top: 16rpx;
  font-size: 22rpx;
  line-height: 1.6;
  color: #8c93a1;
}

.preview-sort-area {
  width: 100%;
  margin-top: 16rpx;
  position: relative;
}

.preview-drag-item {
  z-index: 1;
}

.preview-drag-item.dragging {
  z-index: 8;
}

.preview-cover-tag {
  position: absolute;
  left: 10rpx;
  top: 10rpx;
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: rgba(225, 91, 77, 0.92);
  color: #ffffff;
  font-size: 18rpx;
  font-weight: 700;
}

.preview-remove {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  width: 42rpx;
  height: 42rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(17, 17, 17, 0.72);
  color: #ffffff;
  font-size: 20rpx;
  font-weight: 700;
}

.submit-btn {
  margin-top: 8rpx;
  background: #17181c;
  color: #ffffff;
}

.submit-btn.disabled {
  opacity: 0.6;
}
</style>
