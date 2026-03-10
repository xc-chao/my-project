/**
 * @param {Egg.Application} app - egg application
 */
// commonjs 模块 路由模块
module.exports = app => {

  // app 应用
  // router 路由
  // controller 控制器
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret);
  
  router.get('/', controller.home.index);
  router.post('/add', controller.home.add);
  // 用户模块
  router.post('/register', controller.user.register); // 注册
  router.post('/login', controller.user.login); // 登录
  router.post('/token/refresh', controller.token.refresh); // 刷新token
  router.post('/upload', controller.upload.index); // 上传文件
  // 部分修改资源 put 完全替换（文件）   patch 部分
  router.patch('/user/signature', _jwt, controller.user.editSignature)
  router.get('/user/getUserInfo', _jwt, controller.user.getUserInfo)

  // 账单模块 restful api
  router.post('/bill', _jwt, controller.bill.add) // 新增账单
  router.patch('/bill/:id', _jwt, controller.bill.update) // 修改账单
  router.delete('/bill/:id',_jwt,controller.bill.delete) //
  router.get('/bill/:id', _jwt, controller.bill.detail) // 获取账单详情
};