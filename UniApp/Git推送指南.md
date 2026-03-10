# 📤 Git 推送到 GitHub 指南

## 🔍 当前状态分析

### 你的 Git 状态

```bash
$ git status
位于分支 Uniapp
无文件要提交，干净的工作区  ✅ 本地代码已提交

$ git remote -v
origin https://github.com/xc-chao/my-project.git  ✅ 已配置远程仓库

$ git log
bcb73ea feat: 微信小程序
5c2eaa4 feat: 小程序购物开发  ✅ 本地有2个提交
```

**问题**：本地有提交，但没有 push 到远程 GitHub → 远程仓库是空的

---

## 🚀 解决方案

### 方法 1：使用终端推送（推荐）

在你的 macOS 终端中执行：

```bash
cd /Users/qq/Desktop/Uniapp

# 推送到远程仓库
git push -u origin Uniapp
```

**会提示输入**：
```
Username for 'https://github.com': 
Password for 'https://xc-chao@github.com':
```

**输入**：
- Username: `xc-chao`
- Password: `你的GitHub密码` 或 `Personal Access Token`

**注意**：GitHub 从 2021 年起不再支持密码登录，需要使用 **Personal Access Token**

---

### 方法 2：生成 GitHub Token

#### 步骤 1：创建 Token

1. 访问：https://github.com/settings/tokens
2. 点击 **"Generate new token"** → **"Generate new token (classic)"**
3. 填写信息：
   - Note: `ScanShop Project`
   - Expiration: `No expiration` 或选择期限
   - 勾选 scope: ✅ **repo**（完整的仓库权限）
4. 点击 **"Generate token"**
5. **复制生成的 token**（只显示一次！）

#### 步骤 2：使用 Token 推送

```bash
cd /Users/qq/Desktop/Uniapp

# 使用 token 推送（替换 <YOUR_TOKEN>）
git push https://<YOUR_TOKEN>@github.com/xc-chao/my-project.git Uniapp
```

---

### 方法 3：使用 SSH（一劳永逸）

#### 步骤 1：生成 SSH 密钥

```bash
# 生成密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 按3次回车（使用默认设置）

# 查看公钥
cat ~/.ssh/id_ed25519.pub
```

#### 步骤 2：添加到 GitHub

1. 复制公钥内容
2. 访问：https://github.com/settings/keys
3. 点击 **"New SSH key"**
4. 粘贴公钥，点击 **"Add SSH key"**

#### 步骤 3：更改远程仓库 URL

```bash
# 改为 SSH 方式
git remote set-url origin git@github.com:xc-chao/my-project.git

# 推送
git push -u origin Uniapp
```

---

## 📋 完整的推送流程

### 如果你有GitHub账号密码/Token

```bash
# 1. 进入项目目录
cd /Users/qq/Desktop/Uniapp

# 2. 查看状态
git status

# 3. 推送（会提示输入密码/token）
git push -u origin Uniapp

# 4. 输入用户名和密码/token

# 5. 推送成功
```

### 推送成功后

访问：https://github.com/xc-chao/my-project

应该能看到：
- ✅ Uniapp 分支
- ✅ 2 个提交记录
- ✅ 所有代码文件

---

## 🎯 当前的分支情况

```
本地分支：
  * Uniapp (当前分支，有2个提交)
  * main (空分支)

远程分支：
  无（还没有推送）
```

**需要做的**：
```bash
git push -u origin Uniapp
```

`-u` 的作用：设置上游分支，以后只需 `git push` 即可

---

## ⚠️ 常见问题

### Q: 提示"致命错误：无法访问"？

**A**: 网络问题或认证问题
- 检查网络连接
- 确认 GitHub 账号和密码/token

### Q: 不记得 GitHub 密码？

**A**: 使用 Personal Access Token
- 访问 https://github.com/settings/tokens
- 生成新 token
- 使用 token 代替密码

### Q: 推送后 GitHub 上看不到代码？

**A**: 检查分支
- 确认在 Uniapp 分支
- 可能默认显示 main 分支
- 切换到 Uniapp 分支查看

---

## 🎊 推送后的效果

在 GitHub 上应该能看到：

```
https://github.com/xc-chao/my-project

ScanShop 项目
├── backend/          # 后端代码
├── frontend/         # 前端代码
├── database/         # 数据库脚本
├── README.md
└── ...

分支：Uniapp
提交：2 commits
- bcb73ea feat: 微信小程序
- 5c2eaa4 feat: 小程序购物开发
```

---

## 💡 推荐操作

### 在你的终端执行：

```bash
cd /Users/qq/Desktop/Uniapp
git push -u origin Uniapp
```

然后输入你的 GitHub 用户名和 Token（不是密码！）

**如果需要帮助创建 Token，告诉我！** 🔐


