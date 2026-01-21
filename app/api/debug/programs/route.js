import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const allPrograms = await prisma.program.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const publishedPrograms = await prisma.program.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({
    total: allPrograms.length,
    published: publishedPrograms.length,
    allPrograms: allPrograms.map(p => ({
      id: p.id,
      titleEn: p.titleEn,
      type: p.type,
      published: p.published,
      sortOrder: p.sortOrder,
    })),
    publishedPrograms: publishedPrograms.map(p => ({
      id: p.id,
      titleEn: p.titleEn,
      type: p.type,
      sortOrder: p.sortOrder,
    })),
  }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}
