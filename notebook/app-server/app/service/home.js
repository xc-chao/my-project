// Service 模块 sql 服务
'use strict';

const Service = require('egg').Service;

class HomeService extends Service {
    async user() {
        return {
            name: "嘎子",
            slogen: "潘子说我不应该带货...."
        }
    }
}

module.exports =  HomeService;