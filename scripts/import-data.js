const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

// Load environment variables from .env.production.local
const envPath = path.join(process.cwd(), ".env.production.local");
if (fs.existsSync(envPath)) {
  console.log("📝 Loading environment from .env.production.local");
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
} else {
  console.error("❌ .env.production.local not found!");
  console.error(`   Expected: ${envPath}`);
  process.exit(1);
}

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

async function importData() {
  console.log("📥 Importing data to remote database...");
  console.log(`   Database: ${process.env.DATABASE_URL?.substring(0, 50)}...`);
  console.log("");

  const exportPath = path.join(process.cwd(), "data-export.json");
  if (!fs.existsSync(exportPath)) {
    console.error("❌ data-export.json not found!");
    console.error(`   Expected path: ${exportPath}`);
    console.error("   Run export-data.js first.");
    process.exit(1);
  }

  console.log("✅ Found data-export.json");
  const data = JSON.parse(fs.readFileSync(exportPath, "utf-8"));

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
        // Convert SQLite integers to PostgreSQL booleans
        if (typeof programData.published === 'number') {
          programData.published = programData.published === 1;
        }
        await prisma.program.create({ data: programData });
      }
    }

    // Import Partners
    if (data.partners && data.partners.length > 0) {
      console.log(`📝 Importing ${data.partners.length} Partners...`);
      for (const partner of data.partners) {
        const { id, ...partnerData } = partner;
        // Convert SQLite integers to PostgreSQL booleans
        if (typeof partnerData.published === 'number') {
          partnerData.published = partnerData.published === 1;
        }
        await prisma.partner.create({ data: partnerData });
      }
    }

    // Import PastEvents
    if (data.pastEvents && data.pastEvents.length > 0) {
      console.log(`📝 Importing ${data.pastEvents.length} PastEvents...`);
      for (const event of data.pastEvents) {
        const { id, ...eventData } = event;
        // Convert SQLite integers to PostgreSQL booleans
        if (typeof eventData.published === 'number') {
          eventData.published = eventData.published === 1;
        }
        await prisma.pastEvent.create({ data: eventData });
      }
    }

    console.log("");
    console.log("✅ Data import completed successfully!");
    console.log("");
  } catch (error) {
    console.error("");
    console.error("❌ Import failed:");
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

importData()
  .then(() => {
    console.log("🎉 Import completed successfully!");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
