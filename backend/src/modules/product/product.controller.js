import { ok } from '../../common/utils/response.js';
import { productService } from './product.service.js';

export const productController = {
  list(req, res) {
    const list = productService.listProducts();
    return ok(res, {
      list,
      page: Number(req.query.page || 1),
      pageSize: Number(req.query.pageSize || list.length)
    });
  },
  detail(req, res) {
    const product = productService.getProductDetail(req.params.id);
    return ok(res, product);
  },
  categories(_req, res) {
    return ok(res, productService.listCategories());
  }
};
