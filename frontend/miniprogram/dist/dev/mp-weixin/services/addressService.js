"use strict";
const services_request = require("./request.js");
function getAddressList() {
  return services_request.request("/addresses");
}
function createAddress(payload) {
  return services_request.request("/addresses", {
    method: "POST",
    data: payload
  });
}
function updateAddress(id, payload) {
  return services_request.request(`/addresses/${id}`, {
    method: "PUT",
    data: payload
  });
}
function deleteAddress(id) {
  return services_request.request(`/addresses/${id}`, {
    method: "DELETE"
  });
}
exports.createAddress = createAddress;
exports.deleteAddress = deleteAddress;
exports.getAddressList = getAddressList;
exports.updateAddress = updateAddress;
