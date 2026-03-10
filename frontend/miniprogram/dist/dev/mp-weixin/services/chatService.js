"use strict";
const services_request = require("./request.js");
function createChatSession(productId) {
  return services_request.request("/chat/sessions", {
    method: "POST",
    data: {
      productId
    }
  });
}
function sendChatMessage(sessionId, question) {
  return services_request.request("/chat/messages", {
    method: "POST",
    data: {
      sessionId,
      question
    }
  });
}
exports.createChatSession = createChatSession;
exports.sendChatMessage = sendChatMessage;
