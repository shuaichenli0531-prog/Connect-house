// 添加示例二维码
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addQRCode() {
  console.log('🔲 Adding QR code to site config...\n');

  try {
    const updated = await prisma.siteConfig.update({
      where: { id: 1 },
      data: {
        qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://example.com/apply",
      },
    });

    console.log('✅ QR code added successfully!');
    console.log('   URL:', updated.qrCodeUrl);
    console.log('\n📱 Now refresh your homepage to see the QR code in the contact section!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);

    if (error.message.includes('Unknown field')) {
      console.log('\n⚠️  Database field not yet created!');
      console.log('   Please run: npx prisma db push\n');
    }
  } finally {
    await prisma.$disconnect();
  }
}

addQRCode();
