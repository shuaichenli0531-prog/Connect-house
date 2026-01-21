const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

// Force using local SQLite database
process.env.DATABASE_URL = "file:./prisma/dev.db";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./prisma/dev.db"
    }
  }
});

async function exportData() {
  try {
    console.log("📦 Exporting data from local database...");
    console.log(`   Database: ${process.env.DATABASE_URL}`);
    console.log("");

    // Test database connection
    await prisma.$connect();
    console.log("✅ Database connected");

    const data = {
      siteConfig: await prisma.siteConfig.findFirst(),
      programs: await prisma.program.findMany(),
      partners: await prisma.partner.findMany(),
      pastEvents: await prisma.pastEvent.findMany(),
    };

    const jsonData = JSON.stringify(data, null, 2);
    const exportPath = path.join(process.cwd(), "data-export.json");
    fs.writeFileSync(exportPath, jsonData);

    console.log("");
    console.log("✅ Data exported to data-export.json");
    console.log(`   Path: ${exportPath}`);
    console.log(`   - SiteConfig: ${data.siteConfig ? '1 record' : 'none'}`);
    console.log(`   - Programs: ${data.programs.length} records`);
    console.log(`   - Partners: ${data.partners.length} records`);
    console.log(`   - PastEvents: ${data.pastEvents.length} records`);
    console.log("");

  } catch (error) {
    console.error("");
    console.error("❌ Export failed:");
    console.error("   Error:", error.message);
    if (error.code) {
      console.error("   Code:", error.code);
    }
    console.error("");
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

exportData()
  .then(() => {
    console.log("🎉 Export completed successfully!");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
