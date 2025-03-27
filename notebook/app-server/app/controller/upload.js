const BaseController = require('./base');
const fs = require('fs');
const path = require('path');

class UploadController extends BaseController {
  async moveFile(source, target) {
    try {
      // 确保目标目录存在
      const targetDir = path.dirname(target);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      // 移动文件
      fs.renameSync(source, target);
      return true;
    } catch (error) {
      console.error('移动文件失败:', error);
      return false;
    }
  }

  async index() {
    const { ctx, app } = this;
    try {
      // 用户身份验证
      const token = ctx.request.header.authorization;
      const decode = app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) {
        ctx.body = {
          code: 401,
          msg: '用户未登录',
          data: null
        };
        return;
      }

      // 获取上传文件
      const files = ctx.request.files;
      if (!files || files.length === 0) {
        ctx.body = {
          code: 400,
          msg: '请选择要上传的文件',
          data: null
        };
        return;
      }
      const file = files[0];

      // 处理文件上传
      const fileExt = path.extname(file.filename).toLowerCase().substring(1);
      if (!['jpg', 'jpeg', 'png'].includes(fileExt)) {
        ctx.body = {
          code: 400,
          msg: '文件格式不支持',
          data: null
        };
        return;
      }

      // 生成文件路径
      const fileName = `${Date.now()}.${fileExt}`;
      const targetPath = path.join(app.baseDir, 'app/public/upload', fileName);
      
      // 移动文件
      const moveResult = await this.moveFile(file.filepath, targetPath);
      if (!moveResult) {
        ctx.body = {
          code: 500,
          msg: '文件保存失败',
          data: null
        };
        return;
      }

      // 返回文件URL  
      const fileUrl = `${ctx.origin}/public/upload/${fileName}`;
      ctx.body = {
        code: 200,
        msg: '上传成功',
        data: fileUrl
      };
    } catch(err) {
      console.error('文件上传失败:', err);
      ctx.body = {
        code: 500,
        msg: '文件上传失败',
        data: null
      };
    }
  }
}

module.exports = UploadController;