#!/bin/bash

echo "🚀 开始数据同步流程..."
echo ""

# 检查 node 和 npm
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未找到，请先安装 Node.js"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm 未找到，请先安装 npm"
    exit 1
fi

echo "✅ Node.js 和 npm 已安装"
echo ""

# 1. 导出本地数据
echo "📦 步骤 1/4: 导出本地数据..."
node scripts/export-sqlite-simple.js
if [ $? -ne 0 ]; then
    echo "❌ 导出失败"
    exit 1
fi
echo ""

# 3. 创建临时环境变量文件
echo "⚙️  步骤 2/4: 配置远程数据库连接..."
cat > .env.production.local << 'EOF'
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19sYVRraklRcFYwTkEyU3Rya2dmRlgiLCJhcGlfa2V5IjoiMDFLRkczSEFORjVGTVdQV1A1UjU2UEg1RlgiLCJ0ZW5hbnRfaWQiOiI4YjFlY2NkOWExNTBiZWFjZTYyNWNlNWE2YTdiMzBiMjJkY2EyMjMzMTE1ZjQ4MWY0ZTY5NGI1MjI5NWMyMDllIiwiaW50ZXJuYWxfc2VjcmV0IjoiYjU1NTc0ODktY2Y3OC00YTYxLWEyMWUtNmY4ZTIxMDg2MWEyIn0.54ekeDeF13sqL8_U1i8NkyO-9KusIS23GfduM5fo4TY"
DIRECT_URL="postgres://8b1eccd9a150beace625ce5a6a7b30b22dca2233115f481f4e694b52295c209e:sk_laTkjIQpV0NA2StrkgfFX@db.prisma.io:5432/postgres?sslmode=require"
EOF
echo "✅ 环境变量已配置"
echo ""

# 3. 重新生成 Prisma Client（确保使用 PostgreSQL）
echo "🔧 步骤 3/4: 重新生成 Prisma Client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Prisma Client 生成失败"
    exit 1
fi
echo ""

# 4. 导入到远程数据库
echo "📥 步骤 4/4: 导入数据到远程数据库..."
node scripts/import-data.js
if [ $? -ne 0 ]; then
    echo "❌ 导入失败"
    exit 1
fi
echo ""

# 5. 清理临时文件
echo "🧹 清理临时文件..."
rm -f .env.production.local
echo "✅ 临时环境变量文件已删除"
echo ""

echo "🎉 数据同步完成！"
echo ""
echo "📝 接下来："
echo "   1. 访问 https://connect-house.vercel.app 查看网站"
echo "   2. 访问 https://connect-house.vercel.app/admin 管理后台"
echo "   3. data-export.json 文件已保留，可用于备份"
echo ""
