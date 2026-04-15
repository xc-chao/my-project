export type ProductSearchSort = 'comprehensive' | 'priceAsc' | 'priceDesc' | 'hot';

export type ProductSearchFilterKey =
  | 'all'
  | 'newIn48h'
  | 'buyerFavorite'
  | 'onSale'
  | 'categoryShoes'
  | 'categoryClothes'
  | 'categoryAccessories';

export interface ProductSearchQuery {
  keyword?: string;
  sort?: ProductSearchSort;
  scene?: 'newIn48h' | 'buyerFavorite';
  category?: string;
  onSaleOnly?: boolean;
}

export interface ProductSearchPreset {
  keyword?: string;
  sort?: ProductSearchSort;
  filterKey?: ProductSearchFilterKey;
}

const SEARCH_PRESET_KEY = 'shopping_search_preset';

export function getSearchFilterLabel(filterKey: ProductSearchFilterKey) {
  return (
    {
      all: '筛选',
      newIn48h: '48h 上新',
      buyerFavorite: '买手好评',
      onSale: '仅看在售',
      categoryShoes: '鞋靴',
      categoryClothes: '服饰',
      categoryAccessories: '配件'
    }[filterKey] || '筛选'
  );
}

export function resolveSearchFilterQuery(filterKey: ProductSearchFilterKey): ProductSearchQuery {
  if (filterKey === 'newIn48h') {
    return {
      scene: 'newIn48h'
    };
  }

  if (filterKey === 'buyerFavorite') {
    return {
      scene: 'buyerFavorite'
    };
  }

  if (filterKey === 'onSale') {
    return {
      onSaleOnly: true
    };
  }

  if (filterKey === 'categoryShoes') {
    return {
      category: '鞋靴'
    };
  }

  if (filterKey === 'categoryClothes') {
    return {
      category: '服饰'
    };
  }

  if (filterKey === 'categoryAccessories') {
    return {
      category: '配件'
    };
  }

  return {};
}

export function saveSearchPreset(preset: ProductSearchPreset) {
  uni.setStorageSync(SEARCH_PRESET_KEY, preset);
}

export function consumeSearchPreset() {
  const preset = uni.getStorageSync(SEARCH_PRESET_KEY) as ProductSearchPreset | null;

  if (preset) {
    uni.removeStorageSync(SEARCH_PRESET_KEY);
  }

  return preset;
}
