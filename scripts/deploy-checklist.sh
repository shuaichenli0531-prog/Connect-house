#!/bin/bash

echo "🚀 Vercel 部署检查清单"
echo "====================="
echo ""

# 检查 Git
if [ -d ".git" ]; then
  echo "✅ Git 仓库已初始化"
else
  echo "❌ Git 仓库未初始化"
  echo "   运行: git init"
fi

# 检查依赖
if [ -d "node_modules" ]; then
  echo "✅ 依赖已安装"
else
  echo "⚠️  依赖未安装"
  echo "   运行: npm install"
fi

# 检查环境变量
if [ -f ".env" ]; then
  echo "✅ .env 文件存在"
  echo "   记住：需要在 Vercel 中单独配置环境变量！"
else
  echo "⚠️  .env 文件不存在"
fi

# 检查配置文件
if [ -f "vercel.json" ]; then
  echo "✅ vercel.json 配置存在"
else
  echo "❌ vercel.json 配置缺失"
fi

if [ -f ".gitignore" ]; then
  echo "✅ .gitignore 文件存在"
else
  echo "❌ .gitignore 文件缺失"
fi

# 检查构建
echo ""
echo "📦 测试构建..."
npm run build > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "✅ 构建成功"
else
  echo "❌ 构建失败"
  echo "   运行: npm run build 查看详细错误"
fi

echo ""
echo "📋 下一步："
echo "1. 确保代码已推送到 GitHub"
echo "2. 访问 https://vercel.com"
echo "3. 导入你的 GitHub 仓库"
echo "4. 配置环境变量（DATABASE_URL, ADMIN_SECRET）"
echo "5. 点击 Deploy"
echo ""
