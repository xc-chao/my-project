"use strict";
const services_request = require("./request.js");
function getCart() {
  return services_request.request("/cart");
}
function addCartItem(payload) {
  return services_request.request("/cart/items", {
    method: "POST",
    data: payload
  });
}
function updateCartItem(id, quantity) {
  return services_request.request(`/cart/items/${id}`, {
    method: "PATCH",
    data: {
      quantity
    }
  });
}
function deleteCartItem(id) {
  return services_request.request(`/cart/items/${id}`, {
    method: "DELETE"
  });
}
exports.addCartItem = addCartItem;
exports.deleteCartItem = deleteCartItem;
exports.getCart = getCart;
exports.updateCartItem = updateCartItem;
