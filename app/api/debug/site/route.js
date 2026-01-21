import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const site = await prisma.siteConfig.findUnique({ where: { id: 1 } });

  return NextResponse.json({
    recentEventImageUrl: site?.recentEventImageUrl,
    recentEventTitleEn: site?.recentEventTitleEn,
    recentEventTitleZh: site?.recentEventTitleZh,
    recentEventDate: site?.recentEventDate,
    recentEventDescEn: site?.recentEventDescEn,
    recentEventDescZh: site?.recentEventDescZh,
    allFields: site,
  }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}
