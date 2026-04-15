# Backend MySQL 启动说明

## 第一步：准备环境变量

复制 `backend/.env.example` 为 `backend/.env`，并按本机 MySQL 实际账号修改：

```bash
cp .env.example .env
```

重点确认以下字段：

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

## 第二步：执行迁移与种子

```bash
npm run db:migrate
npm run db:seed
```

或直接一键初始化：

```bash
npm run db:setup
```

## 第三步：启动服务

```bash
npm run dev
```

默认接口地址为 `http://localhost:3001/api`。

## 前端接入

复制 `frontend/miniprogram/.env.example` 为 `frontend/miniprogram/.env`：

```bash
VITE_API_BASE_URL=http://localhost:3001/api
VITE_USE_MOCK=false
```

这样前端会改为请求真实后端接口，而不是本地 mock。

## 当前第一阶段已落地范围

- `Auth`：微信演示登录、短信登录、获取资料、更新资料、退出登录
- `Product/Search`：商品列表、商品搜索、商品详情、分类查询
- `MySQL`：`users`、`products`、`product_galleries`
