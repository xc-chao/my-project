import { AppError } from '../../common/errors/AppError.js';
import { productRepository } from './product.repository.js';

export const productService = {
  listProducts() {
    return productRepository.findAll();
  },
  getProductDetail(id) {
    const product = productRepository.findById(id);

    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', '商品不存在');
    }

    return product;
  },
  listCategories() {
    return productRepository.listCategories();
  }
};
