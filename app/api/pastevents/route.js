import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const events = await prisma.pastEvent.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(events);
}
