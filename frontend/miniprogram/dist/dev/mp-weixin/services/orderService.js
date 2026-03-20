"use strict";
const services_request = require("./request.js");
function getOrderPreview() {
  return services_request.request("/orders/preview");
}
function createOrder(payload) {
  return services_request.request("/orders", {
    method: "POST",
    data: payload
  });
}
function getOrderList() {
  return services_request.request("/orders");
}
exports.createOrder = createOrder;
exports.getOrderList = getOrderList;
exports.getOrderPreview = getOrderPreview;
