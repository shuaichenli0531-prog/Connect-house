# 🚀 快速数据同步指南

## 📝 一键同步命令

在项目目录下运行：

```bash
./sync-data.sh
```

这个脚本会自动完成以下操作：
1. ✅ 从本地 SQLite 导出数据
2. ✅ 配置远程 PostgreSQL 连接
3. ✅ 重新生成 Prisma Client
4. ✅ 导入数据到远程数据库
5. ✅ 清理临时文件

---

## 🐛 如果脚本无法运行

### 方法 1：在 VS Code 终端运行

1. 打开 VS Code
2. 打开集成终端（Terminal → New Terminal）
3. 运行：
   ```bash
   cd /Users/yanting/Documents/工作/cursor项目/房子官网
   ./sync-data.sh
   ```

### 方法 2：在系统终端运行

1. 打开"终端"应用
2. 运行：
   ```bash
   cd /Users/yanting/Documents/工作/cursor项目/房子官网
   bash sync-data.sh
   ```

### 方法 3：手动分步执行

如果自动脚本有问题，可以手动执行每一步：

```bash
# 1. 导出数据
node scripts/export-data.js

# 2. 创建临时配置
cat > .env.production.local << 'EOF'
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19sYVRraklRcFYwTkEyU3Rya2dmRlgiLCJhcGlfa2V5IjoiMDFLRkczSEFORjVGTVdQV1A1UjU2UEg1RlgiLCJ0ZW5hbnRfaWQiOiI4YjFlY2NkOWExNTBiZWFjZTYyNWNlNWE2YTdiMzBiMjJkY2EyMjMzMTE1ZjQ4MWY0ZTY5NGI1MjI5NWMyMDllIiwiaW50ZXJuYWxfc2VjcmV0IjoiYjU1NTc0ODktY2Y3OC00YTYxLWEyMWUtNmY4ZTIxMDg2MWEyIn0.54ekeDeF13sqL8_U1i8NkyO-9KusIS23GfduM5fo4TY"
DIRECT_URL="postgres://8b1eccd9a150beace625ce5a6a7b30b22dca2233115f481f4e694b52295c209e:sk_laTkjIQpV0NA2StrkgfFX@db.prisma.io:5432/postgres?sslmode=require"
EOF

# 3. 生成 Prisma Client
npx prisma generate

# 4. 导入数据
node scripts/import-data.js

# 5. 清理
rm .env.production.local
```

---

## ✅ 验证同步结果

同步完成后：

1. **访问网站**：https://connect-house.vercel.app
2. **访问后台**：https://connect-house.vercel.app/admin
3. **检查数据**：确认所有内容都已正确显示

---

## 📌 注意事项

1. **图片文件不会自动上传**
   - 本地上传的图片路径（如 `/uploads/xxx.jpg`）不会同步到 Vercel
   - 需要在 Vercel 后台重新上传图片
   - 或使用云存储服务（如 Cloudinary）

2. **数据会被覆盖**
   - 导入脚本会先清空远程数据库
   - 然后导入本地数据
   - 确保本地数据是最新的

3. **备份文件**
   - `data-export.json` 会保留在项目目录
   - 可以用作数据备份
   - 不要提交到 Git（已在 .gitignore）

---

## 🆘 需要帮助？

如果遇到问题，检查：
1. Node.js 是否已安装：`node --version`
2. npm 是否已安装：`npm --version`
3. 是否在正确的目录：`pwd`

或者参考 `DATA_SYNC_GUIDE.md` 获取更详细的说明。
