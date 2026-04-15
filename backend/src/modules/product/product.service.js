import { AppError } from '../../common/errors/AppError.js';
import { productRepository } from './product.repository.js';

export const productService = {
  async listProducts(query = {}) {
    return productRepository.findAll(query);
  },
  async searchProducts(keyword, query = {}) {
    return productRepository.search(keyword, query);
  },
  async getProductDetail(id) {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', '商品不存在');
    }

    return product;
  },
  async listCategories() {
    const categories = await productRepository.listCategories();
    return ['推荐', ...categories];
  }
};
