import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mark as dynamic route to prevent static generation at build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const events = await prisma.pastEvent.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(events);
}
