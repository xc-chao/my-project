"use strict";
const services_request = require("./request.js");
function buildProductQueryString(query = {}) {
  var _a, _b;
  const params = new URLSearchParams();
  if ((_a = query.keyword) == null ? void 0 : _a.trim()) {
    params.set("keyword", query.keyword.trim());
  }
  if (query.sort && query.sort !== "comprehensive") {
    params.set("sort", query.sort);
  }
  if (query.scene) {
    params.set("scene", query.scene);
  }
  if ((_b = query.category) == null ? void 0 : _b.trim()) {
    params.set("category", query.category.trim());
  }
  if (query.onSaleOnly) {
    params.set("onSaleOnly", "1");
  }
  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}
function getProductList(query = {}) {
  return services_request.request(`/products${buildProductQueryString(query)}`);
}
function getProductDetail(id) {
  return services_request.request(`/products/${id}`);
}
exports.getProductDetail = getProductDetail;
exports.getProductList = getProductList;
