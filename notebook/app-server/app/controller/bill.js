const Controller = require('egg').Controller;

class BillController extends Controller{
    async add(){
        const { ctx, app } = this;
        const {
            amount,
            type_id,
            type_name,
            date,
            pay_type,
            remark = ''
         } = ctx.request.body;
         console.log(amount,type_name);
         if(!amount || !type_id || !type_name || !date || !pay_type){
             ctx.body = {
                 code:400,
                 msg:'参数错误'
             }
             return;
         }
         try {
            let user_id = ctx.user.id;
            const result = await ctx.service.bill.add({
                amount,
                type_id,
                type_name,
                date,
                pay_type,
                remark,
                user_id
            })
            ctx.body = {
                code:200,
                msg:'添加成功',
                data:result
            }
         }catch(err){
            ctx.body = {
                code:500,
                msg:'服务器错误'
            }
         }
    }
    async update(){
        const { ctx, app } = this;
        const { id } = ctx.params;
        const {
            amount,
            type_id,
            type_name,
            date,
            pay_type,
            remark = ''
         } = ctx.request.body;
         if(!id ||!amount ||!type_id ||!type_name ||!date ||!pay_type){
             ctx.body = {
                 code:400,
                 msg:'参数错误'
             }
             return;
         } 
         try {
            const user_id = ctx.user.id;
            const result = await ctx.service.bill.update({
                id,
                amount,
                type_id,
                type_name,
                date,
                pay_type,
                remark,
                user_id
            })
            ctx.body = {
                code:200,
                msg:'修改成功',
                data:result
            }
         }catch(err){
            ctx.body = {
                code:500,
                msg:'服务器错误'
            }
         }
    }
    async delete(){
        const { ctx, app } = this;
        const {
            id
         } = ctx.request.body;
         if(!id){
             ctx.body = {
                 code:400,
                 msg:'参数错误'
             }
             return;
         }
         try {
            const user_id = ctx.user.id;
            const result = await ctx.service.bill.delete({
                id,
                user_id
            })
            ctx.body = {
                code:200,
                msg:'删除成功',
                data:result
            }
         }catch(err){
            ctx.body = {
                code:500,
                msg:'服务器错误'
            }
         }
    }
    async list(){
        const { ctx, app } = this;
        const {
            date,
            type_id,
            pay_type
         } = ctx.request.body;
         if(!date ||!type_id ||!pay_type){
             ctx.body = {
                 code:400,
                 msg:'参数错误'
             }
             return;
         }
         try {
            const user_id = ctx.user.id;
            const result = await ctx.service.bill.list({
                date,
                type_id,
                pay_type,
                user_id
            })
            ctx.body = {
                code:200,
                msg:'查询成功',
                data:result
            }
         }catch(err){
            ctx.body = {
                code:500,
                msg:'服务器错误'
            }
         }
    }
    async detail(){
        const {ctx} = this;
        const {id} = ctx.params;
        if(!id){
            ctx.body = {
                code:400,
                msg:'参数错误'
            }
            return;
        }
        try {
            const user_id = ctx.user.id;
            const result = await ctx.service.bill.detail({
                id,
                user_id
            })
            ctx.body = {
                code:200,
                msg:'查询成功',
                data:result
            }
        }catch(err){
            ctx.body = {
                code:500,
                msg:'服务器错误'
            }
        }
        
    }
}

module.exports = BillController;