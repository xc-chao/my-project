const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const { id } = ctx.query;
    ctx.body = `hi, egg疼 ${id}`;
  }

  async user() {
    const { ctx } = this;
    const { id } = ctx.params;
    // controller , 将数据查询交给service 
    const {name, slogen} = await ctx.service.home.user();

    ctx.body = {
      name,
      slogen
    }
  }

  async add() {
    const { ctx } = this;
    // 请求体
    const { title } = ctx.request.body; 
    ctx.body = {
      title
    }
  }
}

module.exports = HomeController;
