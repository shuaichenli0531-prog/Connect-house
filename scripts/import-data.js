const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();

async function importData() {
  console.log("📥 Importing data to remote database...");

  if (!fs.existsSync("data-export.json")) {
    console.error("❌ data-export.json not found. Run export-data.js first.");
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync("data-export.json", "utf-8"));

  try {
    // Clear existing data (optional)
    console.log("🗑️  Clearing existing data...");
    await prisma.pastEvent.deleteMany();
    await prisma.partner.deleteMany();
    await prisma.program.deleteMany();
    await prisma.siteConfig.deleteMany();

    // Import SiteConfig
    if (data.siteConfig) {
      console.log("📝 Importing SiteConfig...");
      const { id, createdAt, updatedAt, ...configData } = data.siteConfig;
      await prisma.siteConfig.create({ data: configData });
    }

    // Import Programs
    if (data.programs && data.programs.length > 0) {
      console.log(`📝 Importing ${data.programs.length} Programs...`);
      for (const program of data.programs) {
        const { id, ...programData } = program;
        await prisma.program.create({ data: programData });
      }
    }

    // Import Partners
    if (data.partners && data.partners.length > 0) {
      console.log(`📝 Importing ${data.partners.length} Partners...`);
      for (const partner of data.partners) {
        const { id, ...partnerData } = partner;
        await prisma.partner.create({ data: partnerData });
      }
    }

    // Import PastEvents
    if (data.pastEvents && data.pastEvents.length > 0) {
      console.log(`📝 Importing ${data.pastEvents.length} PastEvents...`);
      for (const event of data.pastEvents) {
        const { id, ...eventData } = event;
        await prisma.pastEvent.create({ data: eventData });
      }
    }

    console.log("✅ Data import completed successfully!");
  } catch (error) {
    console.error("❌ Import failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

importData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
