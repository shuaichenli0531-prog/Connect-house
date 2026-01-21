# 🚀 Vercel 部署配置指南

## ⚠️ 重要：必须先配置数据库

Vercel 不支持 SQLite，需要使用 PostgreSQL 数据库。

---

## 📦 步骤 1：在 Vercel 创建 Postgres 数据库

### 方法 A：通过 Vercel Dashboard（推荐）

1. **登录 Vercel**：https://vercel.com

2. **进入 Storage 页面**：
   - 点击顶部导航 "Storage"
   - 或访问：https://vercel.com/dashboard/stores

3. **创建 Postgres 数据库**：
   - 点击 "Create Database"
   - 选择 "Postgres"
   - 数据库名称：`connect-house-db`
   - 区域：选择离你最近的（如 Singapore）
   - 点击 "Create"

4. **关联到项目**：
   - 创建完成后，点击 "Connect Project"
   - 选择你的项目 `Connect-house`
   - 点击 "Connect"

5. **Vercel 会自动添加环境变量**：
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   等等...

---

## ⚙️ 步骤 2：配置环境变量

在 Vercel 项目设置中添加/确认以下环境变量：

### 自动添加的（Vercel Postgres 会自动创建）：
- ✅ `POSTGRES_PRISMA_URL` - Prisma 使用的连接池 URL
- ✅ `POSTGRES_URL_NON_POOLING` - 直连 URL（用于迁移）

### 需要手动映射的：

1. **DATABASE_URL**（必需）
   ```
   Name: DATABASE_URL
   Value: 选择 "Reference existing variable"
   选择: POSTGRES_PRISMA_URL
   ```

2. **DIRECT_URL**（必需，用于数据库迁移）
   ```
   Name: DIRECT_URL
   Value: 选择 "Reference existing variable"
   选择: POSTGRES_URL_NON_POOLING
   ```

3. **ADMIN_SECRET**（必需）
   ```
   Name: ADMIN_SECRET
   Value: 你的管理员密码（例如：MySecurePassword123!）
   ```

---

## 🗄️ 步骤 3：初始化数据库

数据库创建后，需要运行迁移和种子数据：

### 方法 A：通过 Vercel CLI（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 关联项目
vercel link

# 拉取环境变量
vercel env pull .env.local

# 运行数据库迁移
npx prisma migrate deploy

# 或者直接推送 schema
npx prisma db push

# 运行种子脚本
node scripts/seed-content.js
```

### 方法 B：通过 Vercel Dashboard

在项目部署成功后，可以在 Vercel 的 "Functions" 中找到数据库相关的函数，手动触发初始化。

---

## 🚀 步骤 4：部署项目

### 如果已经创建了项目：

1. 确保数据库已关联
2. 确保环境变量已配置
3. 触发重新部署：
   - 推送新代码到 GitHub
   - 或在 Vercel Dashboard 点击 "Redeploy"

### 如果是新项目：

1. 访问 https://vercel.com
2. 点击 "Add New..." → "Project"
3. 选择 `Connect-house` 仓库
4. **不要**立即点击 Deploy
5. 先完成上面的步骤 1-2（创建数据库和配置环境变量）
6. 然后点击 "Deploy"

---

## ✅ 验证部署成功

部署完成后：

1. **访问你的网站**：
   ```
   https://你的项目名.vercel.app
   ```

2. **访问后台**：
   ```
   https://你的项目名.vercel.app/admin
   ```
   使用你设置的 `ADMIN_SECRET` 登录

3. **添加内容**：
   - 在后台添加项目、合作伙伴等内容

---

## 🐛 常见问题

### 1. 部署失败：数据库连接错误

**原因**：环境变量未正确配置

**解决**：
- 检查 `DATABASE_URL` 是否引用了 `POSTGRES_PRISMA_URL`
- 检查 `DIRECT_URL` 是否引用了 `POSTGRES_URL_NON_POOLING`

### 2. 网站打开但数据为空

**原因**：数据库未初始化

**解决**：
```bash
vercel env pull .env.local
npx prisma db push
node scripts/seed-content.js
```

### 3. 图片上传失败

**原因**：Vercel 文件系统是只读的

**解决**：需要使用云存储服务（Vercel Blob、Cloudinary 等）

---

## 📞 需要帮助？

如果遇到问题：
1. 查看 Vercel 部署日志
2. 检查环境变量配置
3. 确认数据库已正确创建和关联
