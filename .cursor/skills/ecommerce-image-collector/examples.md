# 使用示例

## 示例 1：采集首页主视觉图

用户输入：

```text
帮我找几张适合当前电商小程序首页的球鞋 banner 图，要求能本地化到项目里。
```

期望执行：

1. 确认目标页面是首页。
1. 优先采集 `hero` 类图片。
1. 把图片下载到 `frontend/miniprogram/src/static/local-images/hero/`。
1. 使用类似下面的命名：

```text
hero-sneaker-campaign-01.jpg
hero-sneaker-campaign-02.jpg
```

1. 如用户要求接入页面，则更新：

- `frontend/miniprogram/src/pages/home/index.vue`
- 或 `frontend/miniprogram/src/mock/data.ts` 中的 banner 映射

## 示例 2：采集商品卡封面图

用户输入：

```text
帮我从公开商品页抓几张鞋服商品图，替换首页和搜索页卡片里的图片。
```

期望执行：

1. 确认图片类型为 `products`。
1. 优先提取商品主图，而不是详情长图。
1. 下载到：

```text
frontend/miniprogram/src/static/local-images/products/
```

1. 统一命名，例如：

```text
product-jordan-low-01.jpg
product-hoodie-street-01.jpg
product-jacket-brown-01.jpg
```

1. 替换这些位置的引用：

- `frontend/miniprogram/src/mock/data.ts`
- `frontend/miniprogram/src/pages/home/index.vue`
- `frontend/miniprogram/src/pages/search/index.vue`

## 示例 3：采集商品详情主图与详情图

用户输入：

```text
把这个商品链接里的主图和详情图都抓下来，接到商品详情页。
```

期望执行：

1. 区分主图和详情图：
   - 主图可放 `products/` 或 `details/`
   - 详情长图放 `details/`
1. 命名示例：

```text
product-jordan-detail-cover-01.jpg
detail-jordan-detail-02.jpg
detail-jordan-detail-03.jpg
```

1. 更新：

- `frontend/miniprogram/src/pages/product/detail.vue`
- 如项目使用数据驱动，也同步更新 `frontend/miniprogram/src/mock/data.ts`

## 示例 4：采集登录页或品牌氛围图

用户输入：

```text
帮我找几张更适合登录页的品牌氛围图，要有潮流感和生活方式感。
```

期望执行：

1. 将图片归类到 `lifestyle/` 或 `hero/`。
1. 选择人物穿搭、门店场景、潮流陈列类图片。
1. 下载到：

```text
frontend/miniprogram/src/static/local-images/lifestyle/
```

1. 命名示例：

```text
lifestyle-login-style-01.jpg
lifestyle-street-fashion-01.jpg
```

1. 替换：

- `frontend/miniprogram/src/pages/auth/login.vue`

## 示例 5：一次性整理一批图并给出汇总

用户输入：

```text
帮我采一批图：首页 2 张、商品卡 6 张、详情页 4 张，并告诉我分别落在哪些目录。
```

期望输出结构：

```markdown
本次采集完成：

- 首页图：2 张，目录 `frontend/miniprogram/src/static/local-images/hero/`
- 商品卡图：6 张，目录 `frontend/miniprogram/src/static/local-images/products/`
- 详情图：4 张，目录 `frontend/miniprogram/src/static/local-images/details/`

本地文件清单：
- hero-sneaker-campaign-01.jpg
- hero-sneaker-campaign-02.jpg
- product-jordan-low-01.jpg
- ...

已替换页面：
- 首页
- 搜索页
- 商品详情页

待确认：
- 图片来源版权是否满足商用要求
```

## 示例 6：当页面阻止抓取时

用户输入：

```text
帮我抓这个商品页的全部图片。
```

如果遇到以下情况：

- 必须登录后才能看图
- 强验证码
- 图片接口被严格反爬保护

建议回复：

```text
这个页面的图片资源目前受登录或反爬限制，不能直接按正常流程抓取。
我可以继续帮你做两种替代方案：
1. 你提供可公开访问的商品链接或图片包
2. 我帮你改为采集可公开访问的同类商品图
```
