const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');

class BaseController extends Controller {
  success(data = {}) {
    const { ctx } = this;
    ctx.body = {
      code: 200,
      data
    }
  }
  error(errMsg = '') {
    const { ctx } = this;
    ctx.body = {
      code: 500,
      errMsg
    }
  }

  async moveFile(source, target) {
    try {
      // 确保目标目录存在
      const targetDir = path.dirname(target);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // 移动文件
      await fs.promises.rename(source, target);
      return true;
    } catch (error) {
      console.error('移动文件失败:', error);
      return false;
    }
  }
}

module.exports = BaseController;