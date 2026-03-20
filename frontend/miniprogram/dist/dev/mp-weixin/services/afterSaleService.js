"use strict";
const services_request = require("./request.js");
function getAfterSaleList() {
  return services_request.request("/after-sales");
}
function createAfterSale(payload) {
  return services_request.request("/after-sales", {
    method: "POST",
    data: payload
  });
}
exports.createAfterSale = createAfterSale;
exports.getAfterSaleList = getAfterSaleList;
