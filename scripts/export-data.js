const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();

async function exportData() {
  console.log("📦 Exporting data from local database...");

  const data = {
    siteConfig: await prisma.siteConfig.findFirst(),
    programs: await prisma.program.findMany(),
    partners: await prisma.partner.findMany(),
    pastEvents: await prisma.pastEvent.findMany(),
  };

  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync("data-export.json", jsonData);

  console.log("✅ Data exported to data-export.json");
  console.log(`   - SiteConfig: ${data.siteConfig ? '1 record' : 'none'}`);
  console.log(`   - Programs: ${data.programs.length} records`);
  console.log(`   - Partners: ${data.partners.length} records`);
  console.log(`   - PastEvents: ${data.pastEvents.length} records`);

  await prisma.$disconnect();
}

exportData()
  .catch((e) => {
    console.error("❌ Export failed:", e);
    process.exit(1);
  });
