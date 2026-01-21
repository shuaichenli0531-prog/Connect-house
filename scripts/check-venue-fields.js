const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkFields() {
  try {
    const site = await prisma.siteConfig.findUnique({ where: { id: 1 } });

    console.log('\n=== Venue Fields Check ===');
    console.log('venueImageUrl:', site?.venueImageUrl || '(empty)');
    console.log('venueNameEn:', site?.venueNameEn !== undefined ? site.venueNameEn : '❌ FIELD NOT EXISTS');
    console.log('venueNameZh:', site?.venueNameZh !== undefined ? site.venueNameZh : '❌ FIELD NOT EXISTS');
    console.log('venueDescEn:', site?.venueDescEn !== undefined ? site.venueDescEn : '❌ FIELD NOT EXISTS');
    console.log('venueDescZh:', site?.venueDescZh !== undefined ? site.venueDescZh : '❌ FIELD NOT EXISTS');
    console.log('venueCapacityEn:', site?.venueCapacityEn !== undefined ? site.venueCapacityEn : '❌ FIELD NOT EXISTS');
    console.log('venueCapacityZh:', site?.venueCapacityZh !== undefined ? site.venueCapacityZh : '❌ FIELD NOT EXISTS');
    console.log('========================\n');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkFields();
