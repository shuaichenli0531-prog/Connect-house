// 为历史活动添加示例数据
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sampleEvents = [
  {
    titleEn: "Founder Summit 2024",
    titleZh: "创始人峰会 2024",
    descEn: "A gathering of innovative founders and investors discussing the future of AI and cross-border innovation.",
    descZh: "创新创始人与投资者齐聚一堂，共同探讨 AI 与跨境创新的未来。",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
    date: "2024-03-15",
    sortOrder: 1,
    published: true,
  },
  {
    titleEn: "AI Research Symposium",
    titleZh: "AI 研究研讨会",
    descEn: "Leading researchers share breakthrough findings in machine learning and artificial intelligence.",
    descZh: "顶尖研究人员分享机器学习和人工智能领域的突破性发现。",
    imageUrl: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1200&q=80",
    date: "2024-02-28",
    sortOrder: 2,
    published: true,
  },
  {
    titleEn: "Cross-Border Demo Day",
    titleZh: "跨境路演日",
    descEn: "Startups pitch their innovative solutions to a curated audience of global investors.",
    descZh: "初创企业向精选的全球投资者展示其创新解决方案。",
    imageUrl: "https://images.unsplash.com/photo-1559223607-a43c990c8f07?w=1200&q=80",
    date: "2024-01-20",
    sortOrder: 3,
    published: true,
  },
];

async function seedPastEvents() {
  console.log('🌱 Seeding past events...\n');

  try {
    // 检查是否已有数据
    const existingCount = await prisma.pastEvent.count();

    if (existingCount > 0) {
      console.log(`⚠️  Already have ${existingCount} events.`);
      console.log('   Do you want to add more? (This will not delete existing ones)\n');
      // 继续添加
    }

    for (const event of sampleEvents) {
      const created = await prisma.pastEvent.create({
        data: event,
      });
      console.log(`✅ Created: ${created.titleEn}`);
    }

    console.log(`\n✨ Successfully seeded ${sampleEvents.length} events!`);
    console.log('\n🎉 Now refresh your homepage to see the carousel!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'P2002') {
      console.log('   (Events might already exist)');
    }
  } finally {
    await prisma.$disconnect();
  }
}

seedPastEvents();
