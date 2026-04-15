"use strict";
const common_vendor = require("../common/vendor.js");
const SEARCH_PRESET_KEY = "shopping_search_preset";
function getSearchFilterLabel(filterKey) {
  return {
    all: "筛选",
    newIn48h: "48h 上新",
    buyerFavorite: "买手好评",
    onSale: "仅看在售",
    categoryShoes: "鞋靴",
    categoryClothes: "服饰",
    categoryAccessories: "配件"
  }[filterKey] || "筛选";
}
function resolveSearchFilterQuery(filterKey) {
  if (filterKey === "newIn48h") {
    return {
      scene: "newIn48h"
    };
  }
  if (filterKey === "buyerFavorite") {
    return {
      scene: "buyerFavorite"
    };
  }
  if (filterKey === "onSale") {
    return {
      onSaleOnly: true
    };
  }
  if (filterKey === "categoryShoes") {
    return {
      category: "鞋靴"
    };
  }
  if (filterKey === "categoryClothes") {
    return {
      category: "服饰"
    };
  }
  if (filterKey === "categoryAccessories") {
    return {
      category: "配件"
    };
  }
  return {};
}
function saveSearchPreset(preset) {
  common_vendor.index.setStorageSync(SEARCH_PRESET_KEY, preset);
}
function consumeSearchPreset() {
  const preset = common_vendor.index.getStorageSync(SEARCH_PRESET_KEY);
  if (preset) {
    common_vendor.index.removeStorageSync(SEARCH_PRESET_KEY);
  }
  return preset;
}
exports.consumeSearchPreset = consumeSearchPreset;
exports.getSearchFilterLabel = getSearchFilterLabel;
exports.resolveSearchFilterQuery = resolveSearchFilterQuery;
exports.saveSearchPreset = saveSearchPreset;
