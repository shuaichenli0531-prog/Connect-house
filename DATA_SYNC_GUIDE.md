# 📊 数据同步指南

## 🎯 目标
将本地 SQLite 数据库的数据同步到 Vercel 的远程 PostgreSQL 数据库。

---

## 📝 操作步骤

### **步骤 1：导出本地数据**

在项目目录运行：

```bash
cd /Users/yanting/Documents/工作/cursor项目/房子官网
npm run data:export
```

或者直接运行：

```bash
node scripts/export-data.js
```

这会创建一个 `data-export.json` 文件，包含所有本地数据。

---

### **步骤 2：配置远程数据库环境变量**

创建一个 `.env.production.local` 文件（仅用于本地执行导入）：

```bash
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19sYVRraklRcFYwTkEyU3Rya2dmRlgiLCJhcGlfa2V5IjoiMDFLRkczSEFORjVGTVdQV1A1UjU2UEg1RlgiLCJ0ZW5hbnRfaWQiOiI4YjFlY2NkOWExNTBiZWFjZTYyNWNlNWE2YTdiMzBiMjJkY2EyMjMzMTE1ZjQ4MWY0ZTY5NGI1MjI5NWMyMDllIiwiaW50ZXJuYWxfc2VjcmV0IjoiYjU1NTc0ODktY2Y3OC00YTYxLWEyMWUtNmY4ZTIxMDg2MWEyIn0.54ekeDeF13sqL8_U1i8NkyO-9KusIS23GfduM5fo4TY"
DIRECT_URL="postgres://8b1eccd9a150beace625ce5a6a7b30b22dca2233115f481f4e694b52295c209e:sk_laTkjIQpV0NA2StrkgfFX@db.prisma.io:5432/postgres?sslmode=require"
```

---

### **步骤 3：导入数据到远程数据库**

```bash
npm run data:import
```

或者：

```bash
node scripts/import-data.js
```

---

## ⚠️ 注意事项

1. **导入会清除远程数据库的现有数据**
   - 脚本会先删除所有现有记录
   - 然后导入本地数据

2. **图片路径问题**
   - 如果本地数据中有图片路径（如 `/uploads/xxx.jpg`）
   - 这些图片文件不会自动上传
   - 需要单独处理图片上传

3. **环境隔离**
   - `.env.production.local` 不会被 Git 跟踪
   - 导入完成后可以删除此文件

---

## 🔄 完整命令流程

```bash
# 1. 导出本地数据
npm run data:export

# 2. 创建临时环境变量文件
cat > .env.production.local << 'EOF'
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19sYVRraklRcFYwTkEyU3Rya2dmRlgiLCJhcGlfa2V5IjoiMDFLRkczSEFORjVGTVdQV1A1UjU2UEg1RlgiLCJ0ZW5hbnRfaWQiOiI4YjFlY2NkOWExNTBiZWFjZTYyNWNlNWE2YTdiMzBiMjJkY2EyMjMzMTE1ZjQ4MWY0ZTY5NGI1MjI5NWMyMDllIiwiaW50ZXJuYWxfc2VjcmV0IjoiYjU1NTc0ODktY2Y3OC00YTYxLWEyMWUtNmY4ZTIxMDg2MWEyIn0.54ekeDeF13sqL8_U1i8NkyO-9KusIS23GfduM5fo4TY"
DIRECT_URL="postgres://8b1eccd9a150beace625ce5a6a7b30b22dca2233115f481f4e694b52295c209e:sk_laTkjIQpV0NA2StrkgfFX@db.prisma.io:5432/postgres?sslmode=require"
EOF

# 3. 导入到远程数据库
npm run data:import

# 4. 清理临时文件（可选）
rm .env.production.local
rm data-export.json
```

---

## 🐛 故障排查

### 问题 1：`node: command not found`

**解决方案：**
```bash
# 确认 Node.js 已安装
which node

# 如果未找到，需要重新打开终端或设置 PATH
export PATH="/usr/local/bin:$PATH"
```

### 问题 2：`DATABASE_URL not found`

**解决方案：**
- 确认已创建 `.env.production.local` 文件
- 检查文件内容是否正确

### 问题 3：导入失败

**解决方案：**
```bash
# 重新生成 Prisma Client
npx prisma generate

# 确认数据库表已创建
npx prisma db push

# 再次尝试导入
npm run data:import
```

---

## ✅ 验证数据同步

导入完成后，访问：
```
https://connect-house.vercel.app
```

检查首页是否显示了你的数据。

或者访问后台：
```
https://connect-house.vercel.app/admin
```

确认所有数据都已正确导入。
