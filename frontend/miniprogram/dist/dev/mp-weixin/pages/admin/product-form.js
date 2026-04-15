"use strict";
const common_vendor = require("../../common/vendor.js");
const constants_pageImageMap = require("../../constants/page-image-map.js");
const services_adminService = require("../../services/adminService.js");
const store_modules_user = require("../../store/modules/user.js");
const utils_admin = require("../../utils/admin.js");
if (!Math) {
  (AppHeader + FormSection)();
}
const AppHeader = () => "../../components/AppHeader.js";
const FormSection = () => "../../components/common/FormSection.js";
const galleryColumns = 3;
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "product-form",
  setup(__props) {
    const userStore = store_modules_user.useUserStore();
    const editingId = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    const saving = common_vendor.ref(false);
    const choosingCover = common_vendor.ref(false);
    const choosingGallery = common_vendor.ref(false);
    const draggingGalleryId = common_vendor.ref("");
    const dragGalleryX = common_vendor.ref(0);
    const dragGalleryY = common_vendor.ref(0);
    const currentSales = common_vendor.ref(0);
    const galleryGapPx = common_vendor.index.upx2px(14);
    const galleryThumbHeightPx = common_vendor.index.upx2px(132);
    const galleryContainerPaddingPx = common_vendor.index.upx2px(40 * 2 + 28 * 2);
    const galleryThumbWidthPx = Math.max(
      Math.floor((common_vendor.index.getSystemInfoSync().windowWidth - galleryContainerPaddingPx - galleryGapPx * (galleryColumns - 1)) / galleryColumns),
      72
    );
    const galleryStepX = galleryThumbWidthPx + galleryGapPx;
    const galleryStepY = galleryThumbHeightPx + galleryGapPx;
    const categories = ["鞋靴", "服饰", "配件"];
    const saleStatusOptions = [
      { key: "on_sale", label: "在售" },
      { key: "off_shelf", label: "下架" }
    ];
    const coverOptions = [
      constants_pageImageMap.assetCatalog.products.featured[0],
      constants_pageImageMap.assetCatalog.products.featured[3],
      constants_pageImageMap.assetCatalog.products.featured[5],
      constants_pageImageMap.assetCatalog.products.featured[8],
      constants_pageImageMap.assetCatalog.products.featured[11],
      constants_pageImageMap.assetCatalog.products.featured[15]
    ].filter(Boolean);
    const galleryOptions = [
      constants_pageImageMap.assetCatalog.details.featured[0],
      constants_pageImageMap.assetCatalog.details.featured[2],
      constants_pageImageMap.assetCatalog.details.featured[4]
    ].filter(Boolean);
    const form = common_vendor.reactive({
      title: "",
      subtitle: "",
      category: "鞋靴",
      price: "",
      originalPrice: "",
      stock: "",
      cover: coverOptions[0] || "",
      badgesText: "",
      sizesText: "",
      detail: "",
      galleryText: "",
      saleStatus: "on_sale"
    });
    const pageTitle = common_vendor.computed(() => editingId.value ? "编辑商品" : "新增商品");
    const submitLabel = common_vendor.computed(() => editingId.value ? "保存商品" : "新增商品");
    const galleryPreview = common_vendor.computed(() => {
      return parseList(form.galleryText).map((item, index) => ({
        id: `${index}-${item}`,
        url: item,
        index
      }));
    });
    const gallerySortAreaHeight = common_vendor.computed(() => {
      const rows = Math.max(Math.ceil(galleryPreview.value.length / galleryColumns), 1);
      return rows * galleryThumbHeightPx + Math.max(rows - 1, 0) * galleryGapPx;
    });
    function parseList(value) {
      return value.split(/[\n,，]/).map((item) => item.trim()).filter(Boolean);
    }
    function setGalleryList(list) {
      form.galleryText = list.map((item) => item.trim()).filter(Boolean).join("\n");
    }
    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }
    function getGallerySlot(index) {
      return {
        x: index % galleryColumns * galleryStepX,
        y: Math.floor(index / galleryColumns) * galleryStepY
      };
    }
    function getGalleryItemPosition(index, itemId) {
      if (draggingGalleryId.value === itemId) {
        return {
          x: dragGalleryX.value,
          y: dragGalleryY.value
        };
      }
      return getGallerySlot(index);
    }
    function getGalleryTargetIndex(x, y, total) {
      const maxRow = Math.max(Math.ceil(total / galleryColumns) - 1, 0);
      const col = clamp(Math.round(x / galleryStepX), 0, galleryColumns - 1);
      const row = clamp(Math.round(y / galleryStepY), 0, maxRow);
      return Math.min(row * galleryColumns + col, total - 1);
    }
    function resetGalleryDrag() {
      draggingGalleryId.value = "";
      dragGalleryX.value = 0;
      dragGalleryY.value = 0;
    }
    function fillDefaultGallery(cover = form.cover) {
      const nextCover = cover.trim();
      const gallery = [nextCover, ...galleryOptions.slice(0, 2)].filter(Boolean);
      setGalleryList(gallery);
    }
    function fillForm(item) {
      var _a, _b, _c;
      form.title = (item == null ? void 0 : item.title) || "";
      form.subtitle = (item == null ? void 0 : item.subtitle) || "";
      form.category = (item == null ? void 0 : item.category) || "鞋靴";
      form.price = item ? String(item.price) : "";
      form.originalPrice = item ? String(item.originalPrice) : "";
      form.stock = item ? String(item.stock) : "";
      form.cover = (item == null ? void 0 : item.cover) || coverOptions[0] || "";
      form.badgesText = ((_a = item == null ? void 0 : item.badges) == null ? void 0 : _a.join("，")) || "";
      form.sizesText = ((_b = item == null ? void 0 : item.sizes) == null ? void 0 : _b.join("，")) || "";
      form.detail = (item == null ? void 0 : item.detail) || "";
      form.galleryText = ((_c = item == null ? void 0 : item.gallery) == null ? void 0 : _c.length) ? item.gallery.join("\n") : "";
      form.saleStatus = (item == null ? void 0 : item.saleStatus) || "on_sale";
      currentSales.value = (item == null ? void 0 : item.sales) || 0;
      if (!form.galleryText && form.cover) {
        fillDefaultGallery(form.cover);
      }
    }
    async function loadDetail(id) {
      if (!utils_admin.ensureAdminPageAccess(userStore.isAdmin)) {
        return;
      }
      loading.value = true;
      try {
        const result = await services_adminService.getAdminProductDetail(id);
        fillForm(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : "商品详情加载失败";
        common_vendor.index.showToast({
          title: message,
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    }
    function syncCoverToGallery(cover = form.cover) {
      const nextCover = cover.trim();
      if (!nextCover) {
        common_vendor.index.showToast({
          title: "请先填写封面图地址",
          icon: "none"
        });
        return;
      }
      form.cover = nextCover;
      const current = parseList(form.galleryText);
      if (!current.length) {
        fillDefaultGallery(nextCover);
        return;
      }
      const rest = current.filter((item, index) => index !== 0 && item !== nextCover);
      setGalleryList([nextCover, ...rest]);
    }
    function showConfirmModal(title, content) {
      return new Promise((resolve, reject) => {
        common_vendor.index.showModal({
          title,
          content,
          success: (result) => resolve(result),
          fail: (error) => reject(error)
        });
      });
    }
    async function maybeSyncCoverToGallery(nextCover) {
      const current = parseList(form.galleryText);
      if (!current.length) {
        fillDefaultGallery(nextCover);
        return;
      }
      if (current[0] === nextCover) {
        return;
      }
      const result = await showConfirmModal("同步图集首图", "封面已变更，是否将图集第一张同步为新的封面图？");
      if (result.confirm) {
        syncCoverToGallery(nextCover);
      }
    }
    function isChooseImageCanceled(error) {
      return !!error && typeof error === "object" && "errMsg" in error && String(error.errMsg || "").toLowerCase().includes("cancel");
    }
    function chooseImagesFromAlbum(count) {
      return new Promise((resolve, reject) => {
        common_vendor.index.chooseImage({
          count,
          sizeType: ["compressed"],
          sourceType: ["album"],
          success: (result) => {
            const paths = Array.isArray(result.tempFilePaths) ? result.tempFilePaths : result.tempFilePaths ? [result.tempFilePaths] : [];
            resolve(paths);
          },
          fail: (error) => reject(error)
        });
      });
    }
    async function selectCover(image) {
      if (!image || form.cover === image) {
        return;
      }
      form.cover = image;
      await maybeSyncCoverToGallery(image);
    }
    function appendGalleryImage(image) {
      const next = parseList(form.galleryText);
      if (!next.includes(image)) {
        next.push(image);
      }
      setGalleryList(next);
    }
    function appendGalleryImages(images) {
      const next = parseList(form.galleryText);
      images.forEach((image) => {
        const normalized = image.trim();
        if (normalized && !next.includes(normalized)) {
          next.push(normalized);
        }
      });
      setGalleryList(next);
    }
    function removeGalleryImage(index) {
      const next = parseList(form.galleryText);
      next.splice(index, 1);
      setGalleryList(next);
      if (!next.length) {
        resetGalleryDrag();
      }
    }
    function startGalleryDrag(itemId, index) {
      draggingGalleryId.value = itemId;
      const slot = getGallerySlot(index);
      dragGalleryX.value = slot.x;
      dragGalleryY.value = slot.y;
    }
    function handleGalleryDragChange(itemId, event) {
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
    function finishGalleryDrag(itemId) {
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
        common_vendor.index.showToast({
          title: "封面已更新，记得保存",
          icon: "none"
        });
      } catch (error) {
        if (!isChooseImageCanceled(error)) {
          common_vendor.index.showToast({
            title: "封面选择失败",
            icon: "none"
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
      choosingGallery.value = true;
      try {
        const images = await chooseImagesFromAlbum(6);
        if (!images.length) {
          return;
        }
        appendGalleryImages(images);
        common_vendor.index.showToast({
          title: `已追加 ${images.length} 张图`,
          icon: "none"
        });
      } catch (error) {
        if (!isChooseImageCanceled(error)) {
          common_vendor.index.showToast({
            title: "图集选择失败",
            icon: "none"
          });
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
        common_vendor.index.showToast({
          title: "请完善商品基础信息",
          icon: "none"
        });
        return null;
      }
      if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(originalPrice) || originalPrice <= 0) {
        common_vendor.index.showToast({
          title: "请填写正确的价格",
          icon: "none"
        });
        return null;
      }
      if (!Number.isInteger(stock) || stock < 0) {
        common_vendor.index.showToast({
          title: "库存必须是非负整数",
          icon: "none"
        });
        return null;
      }
      if (!sizes.length) {
        common_vendor.index.showToast({
          title: "请至少填写一个尺码/规格",
          icon: "none"
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
        badges: badges.length ? badges : ["后台新增"],
        sizes,
        detail,
        gallery: gallery.length ? gallery : [cover, ...galleryOptions.slice(0, 2)],
        saleStatus: form.saleStatus
      };
    }
    function goBackToProducts() {
      if (getCurrentPages().length > 1) {
        common_vendor.index.navigateBack();
        return;
      }
      common_vendor.index.redirectTo({
        url: "/pages/admin/products"
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
          await services_adminService.updateAdminProduct(editingId.value, payload);
        } else {
          await services_adminService.createAdminProduct(payload);
        }
        common_vendor.index.showToast({
          title: editingId.value ? "商品已保存" : "商品已新增",
          icon: "success"
        });
        setTimeout(() => {
          goBackToProducts();
        }, 260);
      } catch (error) {
        const message = error instanceof Error ? error.message : "商品保存失败";
        common_vendor.index.showToast({
          title: message,
          icon: "none"
        });
      } finally {
        saving.value = false;
      }
    }
    common_vendor.onLoad((query) => {
      if (!utils_admin.ensureAdminPageAccess(userStore.isAdmin)) {
        return;
      }
      if (typeof (query == null ? void 0 : query.id) === "string" && query.id) {
        editingId.value = query.id;
        loadDetail(query.id);
        return;
      }
      fillForm();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: pageTitle.value,
          back: true
        }),
        b: common_vendor.t(pageTitle.value),
        c: editingId.value
      }, editingId.value ? {
        d: common_vendor.t(editingId.value),
        e: common_vendor.t(currentSales.value)
      } : {}, {
        f: form.title,
        g: common_vendor.o(($event) => form.title = $event.detail.value),
        h: form.subtitle,
        i: common_vendor.o(($event) => form.subtitle = $event.detail.value),
        j: common_vendor.f(categories, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: common_vendor.n({
              active: form.category === item
            }),
            d: common_vendor.o(($event) => form.category = item, item)
          };
        }),
        k: common_vendor.p({
          title: "基础信息",
          desc: "先确定商品标题、副标题和所属分类"
        }),
        l: form.price,
        m: common_vendor.o(($event) => form.price = $event.detail.value),
        n: form.originalPrice,
        o: common_vendor.o(($event) => form.originalPrice = $event.detail.value),
        p: form.stock,
        q: common_vendor.o(($event) => form.stock = $event.detail.value),
        r: common_vendor.f(saleStatusOptions, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: item.key,
            c: common_vendor.n({
              active: form.saleStatus === item.key
            }),
            d: common_vendor.o(($event) => form.saleStatus = item.key, item.key)
          };
        }),
        s: common_vendor.p({
          title: "销售信息",
          desc: "配置价格、库存和上架状态"
        }),
        t: form.badgesText,
        v: common_vendor.o(($event) => form.badgesText = $event.detail.value),
        w: form.sizesText,
        x: common_vendor.o(($event) => form.sizesText = $event.detail.value),
        y: common_vendor.p({
          title: "展示标签",
          desc: "用中文逗号或换行分隔多个值"
        }),
        z: form.detail,
        A: common_vendor.o(($event) => form.detail = $event.detail.value),
        B: common_vendor.p({
          title: "商品说明",
          desc: "填写前台详情页会展示的商品文案"
        }),
        C: common_vendor.o(($event) => form.cover = form.cover.trim()),
        D: form.cover,
        E: common_vendor.o(($event) => form.cover = $event.detail.value),
        F: form.cover
      }, form.cover ? {
        G: form.cover
      } : {}, {
        H: common_vendor.f(common_vendor.unref(coverOptions), (item, k0, i0) => {
          return {
            a: item,
            b: common_vendor.n({
              active: form.cover === item
            }),
            c: item,
            d: common_vendor.o(($event) => selectCover(item), item)
          };
        }),
        I: common_vendor.t(choosingCover.value ? "选择中..." : "从相册选封面"),
        J: common_vendor.n({
          disabled: choosingCover.value
        }),
        K: common_vendor.o(chooseCoverFromAlbum),
        L: common_vendor.o(($event) => syncCoverToGallery(form.cover)),
        M: common_vendor.o(($event) => fillDefaultGallery(form.cover)),
        N: form.galleryText,
        O: common_vendor.o(($event) => form.galleryText = $event.detail.value),
        P: common_vendor.f(common_vendor.unref(galleryOptions), (item, k0, i0) => {
          return {
            a: `gallery-${item}`,
            b: item,
            c: common_vendor.o(($event) => appendGalleryImage(item), `gallery-${item}`)
          };
        }),
        Q: common_vendor.t(choosingGallery.value ? "选择中..." : "从相册追加图集"),
        R: common_vendor.n({
          disabled: choosingGallery.value
        }),
        S: common_vendor.o(chooseGalleryFromAlbum),
        T: galleryPreview.value.length
      }, galleryPreview.value.length ? {} : {}, {
        U: galleryPreview.value.length
      }, galleryPreview.value.length ? {
        V: common_vendor.f(galleryPreview.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.url,
            b: index === 0
          }, index === 0 ? {} : {}, {
            c: common_vendor.o(($event) => removeGalleryImage(item.index), `preview-${item.id}`),
            d: `preview-${item.id}`,
            e: draggingGalleryId.value === item.id ? 1 : "",
            f: getGalleryItemPosition(index, item.id).x,
            g: getGalleryItemPosition(index, item.id).y,
            h: common_vendor.o(($event) => startGalleryDrag(item.id, index), `preview-${item.id}`),
            i: common_vendor.o(($event) => handleGalleryDragChange(item.id, $event), `preview-${item.id}`),
            j: common_vendor.o(($event) => finishGalleryDrag(item.id), `preview-${item.id}`),
            k: common_vendor.o(($event) => finishGalleryDrag(item.id), `preview-${item.id}`)
          });
        }),
        W: `${common_vendor.unref(galleryThumbWidthPx)}px`,
        X: `${common_vendor.unref(galleryThumbHeightPx)}px`,
        Y: `${gallerySortAreaHeight.value}px`
      } : {}, {
        Z: common_vendor.p({
          title: "封面与图集",
          desc: "支持输入地址、使用预设素材，也支持从系统相册选择图片"
        }),
        aa: common_vendor.t(saving.value ? "保存中..." : submitLabel.value),
        ab: common_vendor.n({
          disabled: saving.value || loading.value
        }),
        ac: common_vendor.o(handleSubmit)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-541a5d08"]]);
wx.createPage(MiniProgramPage);
