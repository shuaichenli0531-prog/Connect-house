const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Update site config with images
  const siteConfig = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  if (siteConfig) {
    await prisma.siteConfig.update({
      where: { id: 1 },
      data: {
        heroImageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop",
        venueImageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      },
    });
  }

  // Update programs with images
  const programs = await prisma.program.findMany();
  if (programs.length > 0) {
    await prisma.program.update({
      where: { id: programs[0].id },
      data: {
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
      },
    });
    if (programs[1]) {
      await prisma.program.update({
        where: { id: programs[1].id },
        data: {
          imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop",
        },
      });
    }
    if (programs[2]) {
      await prisma.program.update({
        where: { id: programs[2].id },
        data: {
          imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
        },
      });
    }
  }

  // Update insights with images
  const insights = await prisma.insight.findMany();
  if (insights.length > 0) {
    await prisma.insight.update({
      where: { id: insights[0].id },
      data: {
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
      },
    });
    if (insights[1]) {
      await prisma.insight.update({
        where: { id: insights[1].id },
        data: {
          imageUrl: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=600&h=400&fit=crop",
        },
      });
    }
    if (insights[2]) {
      await prisma.insight.update({
        where: { id: insights[2].id },
        data: {
          imageUrl: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=600&h=400&fit=crop",
        },
      });
    }
  }

  // Update partners with logo placeholders
  const partners = await prisma.partner.findMany();
  for (const partner of partners) {
    await prisma.partner.update({
      where: { id: partner.id },
      data: {
        logoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&size=200&background=C9A56A&color=0B0C10&bold=true`,
      },
    });
  }

  console.log("✅ Content seeded with images");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
