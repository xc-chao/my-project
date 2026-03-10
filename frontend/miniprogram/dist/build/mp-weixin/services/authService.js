"use strict";const t=require("./request.js");exports.loginWithWechat=function(e){return t.request("/auth/wechat-login",{method:"POST",data:e})};
