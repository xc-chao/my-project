# React NoteBook 全栈

- npm i react-router-dom -S 
  --save 的简写  一直依赖  react-router-dom@7 
  --save-dev -D 开发阶段依赖
- 项目阶段
  - 开发阶段 development   vite 
  - 测试阶段 test   其他同事的电脑上 没有环境 npx 
  - 上线阶段 production    打包-》 项目部署？-》 dns -> 上线

- 编程风格
  - react 组件 由函数组件jsx 文件 + 样式文件css 组成
    - 组件目录大写 
    - 组件声明文件小写 名字叫index.jsx 
    引入的时候 直接引入组件目录即可， 组件类的作用， 同时不用去引入 index.jsx 
  - return (JSX)  dom树的对齐， 优雅

- 页面级别组件
  - 首页
    Home.vue 

- es6 module 的语法
  import React, { useState as , useEffect, useMemo } from 'react'
  default  解构的引入
  import React.useState from 'react'
  import * as React from 'react'

  as 起别名

- key 的用法
  循环输出组件，需有给唯一的key 值需要唯一
  update 性能 

- 选择框架
  - zarm 移动端react ui组件库
    指定3.1.2版本 npm i zarm@3.1.2
  - 引入组件 button
  - 引入样式
  - 引入配置ConfigProvider theme  primaryColor
  - 主题定制 theme primaryColor
- npm run build
  - 上线之前先打包
  - dist/ 结果目录
    性能 
    - src/ 开发目录
      代码质量和可读性
    - 不需要注释、换行等，只要浏览器运行就好 
      文件小，压缩， 传输更快
    - 组件打包成js文件， css 打包成一个css文件 
      性能优化 http 并发数 一个js 文件 
      - 依赖关系
        - 不需要模块化
          被依赖的放在上面， 依赖的放在下面
        - 递归依赖关系
        - 打包成一个js文件
    - vite 很快 
    - 截图
      size  gzip 大小 http 主动启动gzip   压缩传输的
      底层是tcp/ip 

- vite
  - 按需加载 vite-plugin-style-import 

- less stylus css 预编译
  - 快 
  - less 
  - 变量、嵌套、混合函数
  - module css 
    - style.module.less
    - 支持 css 模块
      - vite 申明 less -> 解析
      - {s.index} 

- 移动端适配
  rem 10rem = 宽度 
  - lib-flexible  rem 适配 
  - postcss-px2rem 包 自动化px 转 rem  提高开发效率
    - PostCSS 允许开发者通过一系列插件来处理和增强 CSS 文件，使其具备更高的可维护性、兼容性和性能。

- axios  配置
  - baseURL 
    - 前后端分离，前端访问的是后端的接口， 一般都会以/api 开头
    方便， baseURL 统一配置
    - axios + vite proxy
      跨域问题 新解决方案 
  - 请求、响应拦截器
    - 统一的token 设置
    - 统一的错误处理 
      401 404 500  !200 
    - res 丰富的 状态码 config  res ...  库的功能 
    - return res.data 直接返回数据 api一样简单
  - cookie http 1.0 
    - http 协议本身是无状态的 medthod url 返回结果一定一样
    - 小饼干 字符串
    - key=value;key2=value 
    - kb 关键 用户身份等  
    - 请求时都会默认带上， 太大的化会影响http 性能
    - expires 
    - domain 当下域名的cookie 
    - path 限制 cookie /api   /user 
    - httpOnly 请求时带上  js 没有办法获取，更安全 
      XSS 跨站脚本攻击 黑客通过 发文，评论，注入 获取cookie 的代码，并执行
      黑客使用我们cookie 访问某网站， 安全问题
      <script>   <  &lt;
    - secure 安全的cookie  https 协议下才会带上
## 业务开发
- NavBar组件
  - components 公共组件 
  - zarm TabBar TabBar.Item
    activeKey itemKey
  - change setActiveKey 
  - icon 
    - iconfont 定制
  - showNavBar 
    - 默认是false, 路由切换 showNavBar 为true
    - 伪代码 当业务复杂或不太熟悉时可用
    - useLocation 拿到当前的路由， 解构出路径
    - useEffect 监听 路由变化
- react hooks?
  - useState 响应式
  - useEffect 生命周期 副作用
  - memo 缓存组件 
  - useMemo 缓存计算结果
  - useCallback 缓存函数
  - react-router-dom  useNavigate useLocation
  - 函数式编程思想 use hooks 很方便的作用
- react-router-dom
  BrowserRouter HashRouter
  Router Routes Route 组件
  useNavigate useLocation 属于路由， 路由改变 更新
  useEffect 依赖 观察路由变化

- CustomIcon 的组件
  Icon.createFromIconfont
- react-router-dom
  useNavigate  hook 
  navigateTo('/user')
  必须放到router 组件内

- 单页应用 SPA single page application 看过去像一个页面， 移动端 
  - 传统的a 标签 刷新页面 服务器重新渲染， 所有的html, 白屏 慢 体验不好
  - vue/react 优化体验
    - 不能白屏 不要去刷新整个页面 NavBar 
      HashRouter HistoryRouter 支持 hashChange pushState
      不用a 标签， 由router 统一管理
    - Routes router-view  一副牌 看到最上面一张 

- react props 类型约束
  - prop-types
  - 函数组件对象 propTypes 属性 
  - PropTypes.bool

- css
  - react module css 
  - less 
    嵌套
    &
    :global 选择器用于在局部作用域的 LESS 文件中定义全局样式，使指定的 CSS 规则应用到全局范围，而不受局部作用域限制。这在模块化组件开发中非常有用。
  - iconfont 性能优化
  - linear-gradient 线性渐变色 代替图片 
  - px2rem 

- 功能需求分析
  - 登录、注册切换功能
    - 切换下面的表单  useState type login/register
    - onlcick 切换 type 
    - type  active 
    - useEffect + useLocation  url /login /register   
      
- 项目用了哪些包？
  - classnames 动态类名的逻辑安排 

- 记账产品
  - 账单首页 
    - 时间和类型 查询
    - 账单列表
  - 可视化账单 数据
    echarts 图标展示
  - CRUD 用户 账单
    - jwt 
    - 跨域
    - 文件上传
  - 我的
    
## 用户页面的静态开发
  - 行内样式
    {{"":"", }}
  - nth-of-type 会根据元素的类型进行计数
  - align-self baseline 主轴是纵向的， 对齐子元素的宽度

  - react 和 vue slot 和props.children 区别
    - 以modal 组件为例的， 通用组件 万达 负责招商
    - 需要强大的定制性 入驻
      title  footer props string | JSX 传入
    - content 表单｜JSX .... slot(插槽，具名插槽)

## AI 特性
  - prompt 提效的模版
  假如你是前端工程师 使用react + javascript 技术栈， 请根据上图分析功能模块和交互细节 给出要开发的功能点， 难点 和预计需要的开发时间。 只需要开发前端， 后端不需要考虑。

## 首页 静态开发
- 先想清楚， 再动手 ai 
  了解需求的prompt 模版
- 用户的账单列表
  - 所有， 按时间排序 倒序 分页
  - 按类型查询(支出| 收入)
  - 按月份查询 
- 整个页面的统计 响应式 
- 按日期分组
  列表 细节， 并进行支出和收入的统计
- 交互
  - 类型的弹出
  - 日期的弹出
  - 新增支出的弹出 
- 开发时间？
- list 列表业务
  - 比较复杂， 两重循环
  - 按日期分组 数据设计比较复杂
  - 设计稿， prompt ai 来拿假数据 给他一个例子
  假如你是一个前端工程师，请基于const [list, setList] = useState([
    {
      bills: [
        {
          amount: "25.00",
          date: "1740398609507",
          id: 911,
          pay_tye: 1,
          remark: "",
          type_id: 1,
          type_name: "餐饮"
        }
      ],
      date: '2025-02-24'
    }
  ]) 数据格式， 根据上传图片，帮我组织list 初始化的数据 并返回给我， 其他的不做。

  - 封装了Bill 组件
    - 复用
    - 模块化 index 太复杂 代码不要太多 方便维护， 
    - prop-types 类型约束 强大
  - utils
    - 封装公用的js 函数 或配置

## 开发流程
- idear 创意
  - aigc结合
- 需求分析
  - 用户需求
  - 功能点
- 建立数据库
  - 设计表结构
- 前端开发
  - react 
- 后端
  - egg.js 
- 测试
- 部署上线

 CREATE TABLE IF NOT EXISTS user ( 
  id INT AUTO_INCREMENT PRIMARY KEY, 
  username VARCHAR(100) NOT NULL UNIQUE, 
  ctime VARCHAR(100) NOT NULL, 
  avatar VARCHAR(100), 
  signature VARCHAR(100),
   password VARCHAR(100) NOT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

## 代码开发风格的一部分
- AI编程工具的使用
  - MarsCode 
  - Cursor / Trade 
  - prompt engineering 
  - "交互" 前端不可替代
  - 多语言 低代码 快速学习
  - 不只是项目开发前 propmt 生成项目
  - 细节功能 喂伪代码 aigc代码更靠谱

- mysql
  - mysql2 数据库驱动
  - egg-sequelize orm 框架
    不需要写sql 直接对象开干
    封装了sql 
  - service 
    CRUD
  - model 
    User 

- egg.js api 服务
  - 路由 
    http 协议 
  - controller
    extends Controller
    参数校验、 业务逻辑...
    返回接口需要的json 数据
  - model
    模型定义 table -> model
  - service 
    数据库操作 CRUD
  - view
    api 服务， 后端不负责界面, react 负责

- 登录注册
  - 密码加密
    不能存明文， 单项加密
  - jwt json web token
    {
      id:1,
      username: 'chen',
      level: 'lv5',
      exp: 1694355688,
    }
    jwt sign token 
    后端签发 
    - secret 加密 服务器端才能解开
    - 40几位的加密串
    前端localStorage 存
    axios 请求 拦截在请求头中
    authorization: token(localStorage)
    后端verfify token -> json  user

    - egg-jwt jsonwebtoken
   
- 登录
  - 前端 Login组件 submit
  - api/login 全部的请求都在这
    /login { username, password}
  - utils/axios
    - baseURL  /api/login
    - /api 后端提供的接口地址的标志，前后端分离
    - 不带/api, 前端路由react-router-dom 管理
  - axios 请求 被vite 配置的server 拦截
    proxy 解决了跨域问题
    rewrite /api 干掉了 
  - 后端提供接口，后端也可以不只提供接口， 自己的mvc 

- 修改用户slogan 
  全栈功能  前端修改表单 
  后端 Update + MVC 
  - 前后端分离
    - 先后端
      - 提供一个修改slogan的接口
        - 路由
          restful api 一切皆资源  设计url的一种规范
        - 中间件  鉴权
          拦在控制器之前 token -> verify user 挂在ctx上， next
        - 控制器
        - service
          - model 已创建
          - orm  sequelize  
          数据库操作
        - apifox 请求模拟器

    - 再前端
      - 路由
      - userinfo 组件
      - api  editUserInfo

- bill CRUD
  - SQL建表
  - mvc
    - model
    使用AI 生成 prompt 基于sql，使用egg.js sequelize 生成model定义
    - controller
    - service
      - app.model.Bill.create() 新增
      - app.model.Bill.update({}, {
        where: 
      }) 修改
      - app.model.Bill.destroy({}) 

    - router
      restful
      /bill post
      /bill/:id patch
      /bill/:id delete

- 订单详情页全栈开发
  - 后端接口
    - 路由 1.restful 添加路由
    - 中间件
    - 控制器 detail  params id
    - service id -》bill
      - model
      - orm
    - 路由
      /bill/:id get
      返回数据，完成接口开发
    
  - 前端
    - 路由  
    - useLocation + querystring 解析id
    npm 包 query-string 