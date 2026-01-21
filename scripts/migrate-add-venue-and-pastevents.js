// 手动数据库迁移脚本
// 添加 venue 和 pastEvent 相关字段

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
  console.log('🔄 Starting migration...\n');

  try {
    // 检查是否已有数据
    const site = await prisma.siteConfig.findUnique({ where: { id: 1 } });

    if (!site) {
      console.log('❌ No site config found. Please seed the database first.');
      return;
    }

    console.log('✅ Site config found');
    console.log('📊 Current fields:', Object.keys(site));

    // 检查新字段
    const hasVenueFields = 'venueNameEn' in site;
    const hasPastEventsTable = true; // We'll check this by trying to query

    if (hasVenueFields) {
      console.log('\n✅ Venue fields already exist!');
      console.log('   - venueNameEn:', site.venueNameEn || '(empty)');
      console.log('   - venueNameZh:', site.venueNameZh || '(empty)');
      console.log('   - venueCtaEn:', site.venueCtaEn || '(empty)');
      console.log('   - venueCtaZh:', site.venueCtaZh || '(empty)');
    } else {
      console.log('\n⚠️  Venue fields missing!');
      console.log('   Please run: npx prisma db push');
    }

    // Check PastEvent table
    try {
      const pastEvents = await prisma.pastEvent.findMany();
      console.log('\n✅ PastEvent table exists');
      console.log(`   Found ${pastEvents.length} events`);
    } catch (error) {
      console.log('\n⚠️  PastEvent table missing!');
      console.log('   Please run: npx prisma db push');
    }

    console.log('\n✨ Migration check complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
