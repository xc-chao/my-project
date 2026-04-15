import { ok } from '../../common/utils/response.js';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { productService } from './product.service.js';

export const productController = {
  list: asyncHandler(async (req, res) => {
    const result = await productService.listProducts(req.query);
    const categories = await productService.listCategories();

    return ok(res, {
      list: result.list,
      categories,
      page: result.page,
      pageSize: result.pageSize,
      total: result.total
    });
  }),
  search: asyncHandler(async (req, res) => {
    const keyword = String(req.query.keyword || '');
    const result = await productService.searchProducts(keyword, req.query);

    return ok(res, {
      keyword,
      list: result.list,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize
    });
  }),
  detail: asyncHandler(async (req, res) => {
    const product = await productService.getProductDetail(req.params.id);
    return ok(res, product);
  }),
  categories: asyncHandler(async (_req, res) => {
    return ok(res, await productService.listCategories());
  })
};
