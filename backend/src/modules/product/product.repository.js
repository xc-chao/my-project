import { mockDb } from '../../data/mockDb.js';

export const productRepository = {
  findAll() {
    return mockDb.products;
  },
  search(keyword = '') {
    const normalized = keyword.trim().toLowerCase();

    if (!normalized) {
      return mockDb.products;
    }

    return mockDb.products.filter((item) => {
      return [item.title, item.subtitle, item.category].some((field) =>
        field.toLowerCase().includes(normalized)
      );
    });
  },
  findById(id) {
    return mockDb.products.find((item) => item.id === id);
  },
  listCategories() {
    return Array.from(new Set(mockDb.products.map((item) => item.category)));
  }
};
