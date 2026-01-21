// 为最近活动添加示例数据
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedRecentEvent() {
  console.log('🌱 Seeding recent event data...\n');

  try {
    // 更新 SiteConfig 的最近活动字段
    const updated = await prisma.siteConfig.update({
      where: { id: 1 },
      data: {
        recentEventImageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
        recentEventDate: "March 15, 2024",
        recentEventTitleEn: "AI Founder Summit 2024",
        recentEventTitleZh: "AI 创始人峰会 2024",
        recentEventDescEn: "A curated gathering of 100+ founders, investors, and researchers exploring the frontier of artificial intelligence and cross-border innovation.",
        recentEventDescZh: "100+ 位创始人、投资者和研究人员的精选聚会，共同探索人工智能前沿与跨境创新。",
      },
    });

    console.log('✅ Recent event data updated successfully!\n');
    console.log('📊 Event Details:');
    console.log('   Title (EN):', updated.recentEventTitleEn);
    console.log('   Title (ZH):', updated.recentEventTitleZh);
    console.log('   Date:', updated.recentEventDate);
    console.log('   Image:', updated.recentEventImageUrl);
    console.log('\n🎉 Now refresh your homepage to see the Recent Event card!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);

    if (error.code === 'P2025') {
      console.log('\n⚠️  Site config not found. Please run the main seed script first.');
    } else if (error.message.includes('Unknown field')) {
      console.log('\n⚠️  Database fields not yet created!');
      console.log('   Please run: npx prisma db push\n');
    }
  } finally {
    await prisma.$disconnect();
  }
}

seedRecentEvent();
