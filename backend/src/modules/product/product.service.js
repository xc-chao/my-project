import { AppError } from '../../common/errors/AppError.js';
import { productRepository } from './product.repository.js';

export const productService = {
  listProducts() {
    return productRepository.findAll();
  },
  searchProducts(keyword) {
    return productRepository.search(keyword);
  },
  getProductDetail(id) {
    const product = productRepository.findById(id);

    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', '商品不存在');
    }

    return product;
  },
  listCategories() {
    return ['推荐', ...productRepository.listCategories()];
  }
};
