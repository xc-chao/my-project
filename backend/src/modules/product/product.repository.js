import { mockDb } from '../../data/mockDb.js';

export const productRepository = {
  findAll() {
    return mockDb.products;
  },
  findById(id) {
    return mockDb.products.find((item) => item.id === id);
  },
  listCategories() {
    return Array.from(new Set(mockDb.products.map((item) => item.category)));
  }
};
