const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // First check if record exists, if not create it
  const existing = await prisma.siteConfig.findUnique({ where: { id: 1 } });

  const pillarsData = JSON.stringify([
        {
          titleEn: "VC",
          titleZh: "VC",
          descriptionEn: "Access to cross-border capital and strategic partners driving deep tech ventures.",
          descriptionZh: "跨境资本与战略合作伙伴，支持深科技创业。",
          icon: "💰",
          imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop&q=80",
        },
        {
          titleEn: "Labs",
          titleZh: "Labs",
          descriptionEn: "A sandbox for emerging research, founder experimentation, and prototype acceleration.",
          descriptionZh: "前沿研究与创始人实验的加速空间。",
          icon: "🔬",
          imageUrl: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&h=600&fit=crop&q=80",
        },
        {
          titleEn: "Community",
          titleZh: "Community",
          descriptionEn: "A merit-based network of founders, researchers, and investors with shared ambition.",
          descriptionZh: "以能力为核心的创始人、研究者与投资人网络。",
          icon: "🤝",
          imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&q=80",
        },
      ]);

  if (!existing) {
    // Run the seed function if no config exists
    const { seedIfEmpty } = require("../lib/seed");
    await seedIfEmpty();
  }

  await prisma.siteConfig.update({
    where: { id: 1 },
    data: { aboutPillars: pillarsData },
  });

  console.log("✅ About pillars updated with icons and images");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
