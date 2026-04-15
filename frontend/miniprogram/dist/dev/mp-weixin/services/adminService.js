"use strict";
const services_request = require("./request.js");
function getAdminOverview() {
  return services_request.request("/admin/overview");
}
function getAdminProducts() {
  return services_request.request("/admin/products");
}
function getAdminProductDetail(id) {
  return services_request.request(`/admin/products/${id}`);
}
function getAdminOrders() {
  return services_request.request("/admin/orders");
}
function getAdminOrderDetail(id) {
  return services_request.request(`/admin/orders/${id}`);
}
function getAdminFeedback() {
  return services_request.request("/admin/feedback");
}
function getAdminAfterSales(orderId) {
  const query = orderId ? `?orderId=${encodeURIComponent(orderId)}` : "";
  return services_request.request(`/admin/after-sales${query}`);
}
function createAdminProduct(payload) {
  return services_request.request("/admin/products", {
    method: "POST",
    data: payload
  });
}
function updateAdminProduct(id, payload) {
  return services_request.request(`/admin/products/${id}`, {
    method: "PATCH",
    data: payload
  });
}
function updateAdminOrder(id, payload) {
  return services_request.request(`/admin/orders/${id}/status`, {
    method: "PATCH",
    data: payload
  });
}
function updateAdminOrderLogistics(id, payload) {
  return services_request.request(`/admin/orders/${id}/logistics`, {
    method: "PATCH",
    data: payload
  });
}
function updateAdminAfterSale(id, payload) {
  return services_request.request(`/admin/after-sales/${id}/status`, {
    method: "PATCH",
    data: payload
  });
}
function updateAdminFeedback(id, payload) {
  return services_request.request(`/admin/feedback/${id}/status`, {
    method: "PATCH",
    data: payload
  });
}
exports.createAdminProduct = createAdminProduct;
exports.getAdminAfterSales = getAdminAfterSales;
exports.getAdminFeedback = getAdminFeedback;
exports.getAdminOrderDetail = getAdminOrderDetail;
exports.getAdminOrders = getAdminOrders;
exports.getAdminOverview = getAdminOverview;
exports.getAdminProductDetail = getAdminProductDetail;
exports.getAdminProducts = getAdminProducts;
exports.updateAdminAfterSale = updateAdminAfterSale;
exports.updateAdminFeedback = updateAdminFeedback;
exports.updateAdminOrder = updateAdminOrder;
exports.updateAdminOrderLogistics = updateAdminOrderLogistics;
exports.updateAdminProduct = updateAdminProduct;
