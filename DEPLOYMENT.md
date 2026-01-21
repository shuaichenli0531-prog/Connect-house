# 🚀 Vercel 部署指南

## 📋 部署前准备

### 1. 初始化 Git 仓库（如果还没有）

```bash
cd /Users/yanting/Documents/工作/cursor项目/房子官网
git init
git add .
git commit -m "Initial commit"
```

### 2. 推送到 GitHub

1. 在 GitHub 上创建新仓库（不要初始化 README）
2. 关联远程仓库：

```bash
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

---

## 🌐 在 Vercel 上部署

### 方法 1：通过 Vercel 网站（推荐）

1. **访问** [https://vercel.com](https://vercel.com)

2. **登录/注册**
   - 使用 GitHub 账号登录

3. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择你的 GitHub 仓库
   - 点击 "Import"

4. **配置项目**
   - Framework Preset: Next.js（自动检测）
   - Root Directory: `./`（默认）
   - Build Command: `prisma generate && next build`（已在 vercel.json 配置）

5. **配置环境变量**
   点击 "Environment Variables"，添加：

   ```
   DATABASE_URL = file:./prisma/dev.db
   ADMIN_SECRET = 你的管理员密码（建议改成复杂的）
   ```

6. **部署**
   - 点击 "Deploy"
   - 等待 2-3 分钟完成部署

---

### 方法 2：使用 Vercel CLI

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel

# 4. 按提示操作
# - Set up and deploy? Yes
# - Which scope? 选择你的账号
# - Link to existing project? No
# - What's your project's name? house-official-site
# - In which directory is your code located? ./
# - Want to override the settings? No

# 5. 部署到生产环境
vercel --prod
```

---

## ⚙️ 重要配置说明

### 1. 数据库
Vercel 使用的是 **无服务器环境**，SQLite 数据库会在每次部署时重置。

**推荐方案：**

**方案 A：使用 Vercel Postgres（推荐）**
```bash
# 在 Vercel 项目设置中添加 Postgres
# 或访问：https://vercel.com/storage/postgres
```

**方案 B：使用其他云数据库**
- [Planetscale](https://planetscale.com/) (MySQL)
- [Supabase](https://supabase.com/) (PostgreSQL)
- [Railway](https://railway.app/) (PostgreSQL)

### 2. 文件上传
Vercel 的文件系统是只读的，上传的文件不会持久化。

**推荐方案：**
- 使用 [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)
- 或使用 [Cloudinary](https://cloudinary.com/)
- 或使用 [AWS S3](https://aws.amazon.com/s3/)

### 3. 环境变量
在 Vercel Dashboard 中设置：
- `DATABASE_URL` - 数据库连接字符串
- `ADMIN_SECRET` - 管理员密码

---

## 🔄 后续更新部署

每次推送代码到 GitHub 的 `main` 分支，Vercel 会自动部署：

```bash
git add .
git commit -m "更新内容"
git push
```

---

## 🐛 常见问题

### 1. 构建失败
- 检查 `package.json` 中的依赖版本
- 查看 Vercel 构建日志

### 2. 数据库连接失败
- 确保 `DATABASE_URL` 环境变量正确设置
- 如果使用云数据库，检查连接字符串

### 3. 图片上传不显示
- Vercel 文件系统是只读的
- 需要使用云存储服务

---

## 📱 访问你的网站

部署成功后，Vercel 会提供：
- **预览地址**：`https://你的项目名.vercel.app`
- **生产地址**：可以绑定自定义域名

---

## 🎯 下一步优化

1. **绑定自定义域名**
   - Vercel Dashboard → Settings → Domains

2. **设置 HTTPS**
   - 自动提供（Let's Encrypt）

3. **配置云数据库**
   - 迁移到 Vercel Postgres 或其他云数据库

4. **配置文件存储**
   - 集成 Vercel Blob 或 Cloudinary

---

## 📞 需要帮助？

如果部署过程中遇到问题，可以：
1. 查看 Vercel 构建日志
2. 检查环境变量配置
3. 查看本文档的常见问题部分
