import { prisma } from "./prisma";

export async function loadSiteContent() {
  const site = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  const programs = await prisma.program.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  const insights = await prisma.insight.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  const partners = await prisma.partner.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  // Try to load pastEvents, but fallback to empty array if table doesn't exist
  let pastEvents = [];
  try {
    pastEvents = await prisma.pastEvent.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.log("PastEvent table not yet created, skipping...");
  }

  return { site, programs, insights, partners, pastEvents };
}
