const Service = require('egg').Service;

class BillService extends Service {
  async add(bill) {
    const { ctx } = this;

    try {
      const res = await ctx.model.Bill.create(bill);
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async update(params){
    const {
        ctx,
        app
    } = this;

    try {
        // put patch
        let result = await ctx.model.Bill.update({
           ...params
        },{
          where:{
            id:params.id,
            user_id:params.user_id
          }
        })
        return result;
    }catch(err){
        console.log(err);
        return null;
    }
  }
  async delete(params){
    const {
        ctx,
        app
    } = this;

    try {
        // delete
        let result = await ctx.model.Bill.destroy({
          where:{
            id:params.id,
            user_id:params.user_id
          }
        })
        return result;
    }catch(err){
        console.log(err);
        return null;
    }
  }
  async list(params){
    const {
        ctx,
        app
    } = this;
    try {
        // get
        let result = await ctx.model.Bill.findAll({
          where:{
            ...params
          }
        })
        return result;
    }catch(err){
        console.log(err);
        return null;
    }
  }

  async detail(id) {
    const { app } = this;
    try {
      const result = await app.model.Bill.findOne({
        where: {
          id,
        }
      });
      // console.log(result.dataValues,'----------');
      return result;
    } catch(err) {
      console.log(err);
      return null;
    }
  }
}

module.exports = BillService;