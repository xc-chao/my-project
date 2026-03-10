"use strict";
const services_request = require("./request.js");
function getProductList() {
  return services_request.request("/products");
}
function getProductDetail(id) {
  return services_request.request(`/products/${id}`);
}
function searchProducts(keyword) {
  return services_request.request(`/search?keyword=${encodeURIComponent(keyword)}`);
}
exports.getProductDetail = getProductDetail;
exports.getProductList = getProductList;
exports.searchProducts = searchProducts;
