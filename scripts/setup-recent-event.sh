#!/bin/bash

echo "🚀 Setting up Recent Event feature..."
echo ""

echo "1️⃣  Pushing database schema..."
npx prisma db push --skip-generate

echo ""
echo "2️⃣  Generating Prisma client..."
npx prisma generate

echo ""
echo "3️⃣  Seeding recent event data..."
node scripts/seed-recent-event.js

echo ""
echo "✅ Setup complete! Please restart your dev server:"
echo "   npm run dev"
echo ""
