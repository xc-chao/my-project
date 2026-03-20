---
name: ecommerce-image-collector
description: 采集公开可访问的电商商品图片并整理为当前 Uni-app 小程序可直接使用的本地静态资源。适用于用户要求爬取、抓取、下载、分类商品主图、详情图、banner 图或生活方式图，并希望将图片落到 `frontend/miniprogram/src/static/local-images/` 后再接入页面的场景。
---

# 电商图片采集

这个技能用于当前项目的电商图片采集与落盘流程。目标不是保留外链，而是把公开可访问的商品图整理成小程序本地静态资源，并保持目录、命名、分类和页面引用一致。

## 适用场景

当用户提出以下需求时，优先使用这个技能：

- “帮我爬一些电商商品图”
- “把淘宝 / 京东 / 1688 / 商品页图片下载到项目里”
- “为首页、详情页、商品卡换一批网图”
- “整理商品主图、详情图、banner 图、本地化图片资源”

## 使用前提

- 只处理**公开可访问**的页面和图片资源。
- 不绕过登录、验证码、反爬、付费墙或权限控制。
- 不承诺规避平台限制；如果页面阻止抓取，改为提示用户提供允许使用的来源或手动下载资源。
- 图片使用前，应提醒用户确认版权、商用授权和平台条款是否允许。

## 当前项目目录约定

图片统一放在：

- `frontend/miniprogram/src/static/local-images/hero/`
- `frontend/miniprogram/src/static/local-images/products/`
- `frontend/miniprogram/src/static/local-images/details/`
- `frontend/miniprogram/src/static/local-images/lifestyle/`
- `frontend/miniprogram/src/static/local-images/avatars/`

不要继续把新增图片放进：

- `frontend/miniprogram/src/static/banners/`
- `frontend/miniprogram/src/static/products/`

## 分类规则

- `hero`：首页大图、频道头图、活动视觉图
- `products`：商品卡封面、搜索结果卡封面、购物车缩略图
- `details`：商品详情页主图、详情长图、SKU 图
- `lifestyle`：人物穿搭、场景图、品牌氛围图
- `avatars`：用户头像、店铺头像、默认人物图

## 命名规则

统一使用小写英文和连字符，不要包含空格和中文。

推荐格式：

```text
<category>-<brand-or-topic>-<index>.<ext>
```

例如：

- `hero-sneaker-campaign-01.jpg`
- `product-jordan-low-01.jpg`
- `detail-jordan-low-02.webp`
- `lifestyle-denim-style-01.jpg`

## 工作流

### 1. 先确认采集目标

开始前先确认：

- 来源页面或平台
- 需要采集的图片类型：主图 / 详情图 / banner / 场景图
- 最终使用页面：首页 / 搜索 / 商品详情 / 购物车 / 登录页等

### 2. 检查项目当前图片使用点

优先检查这些文件：

- `frontend/miniprogram/src/mock/data.ts`
- `frontend/miniprogram/src/pages/home/index.vue`
- `frontend/miniprogram/src/pages/product/detail.vue`
- `frontend/miniprogram/src/pages/search/index.vue`
- `frontend/miniprogram/src/pages/auth/login.vue`

明确哪些字段或组件会消费图片路径，再决定下载数量和分类。

### 3. 提取图片链接

优先使用以下顺序：

1. 页面中的原始图片 URL
2. 商品详情中的主图数组或缩略图数组
3. 页面可见的 banner / lifestyle 图片

如果页面是动态渲染：

- 优先使用浏览器工具查看实际渲染后的图片 URL
- 必要时用浏览器自动化逐个提取可见图片地址

### 4. 下载并本地化

下载图片后：

- 存入 `frontend/miniprogram/src/static/local-images/<category>/`
- 按命名规范重命名
- 避免保留随机 hash、超长 query string、平台参数名

### 5. 做最小可用筛选

保留时优先选择：

- 主体清晰
- 构图稳定
- 与页面场景匹配
- 尺寸足够大
- 裁切后仍可用

剔除：

- 明显水印图
- 低清模糊图
- 比例极端不适合小程序页面的图
- 带明显平台 UI 截图边框的图

### 6. 更新项目引用

若用户要求接入页面，则继续：

- 更新 `mock/data.ts` 中的 `cover`、`avatar`、banner 映射
- 更新页面中的固定图片路径
- 清理旧的 `/static/banners/` 和 `/static/products/` 引用

### 7. 最后验证

至少验证：

- 图片路径是否可被小程序构建系统正确引用
- 首页、搜索页、详情页是否裁切正常
- 没有遗漏旧资源路径

## 输出要求

完成后应向用户说明：

- 本次采集了哪些图片
- 每张图落在哪个目录
- 哪些页面已切换到新图
- 是否还存在版权或来源确认风险

## 注意事项

- 不要默认所有电商平台都允许自动抓取。
- 不要使用外链作为最终交付结果，除非用户明确要求临时保留。
- 如果图很多，先按页面优先级采集：首页 > 搜索/商品卡 > 详情页 > 其他页面。
- 如果用户只要“可用素材”，优先少量高质量图片，不要一口气导入大量低质量资源。

## 参考

如需补充示例和目录映射，可查看 [reference.md](reference.md)。

如需查看典型用户输入、落盘方式和输出格式，可查看 [examples.md](examples.md)。
