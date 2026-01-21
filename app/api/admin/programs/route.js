import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { seedIfEmpty } from "../../../../lib/seed";

function checkAuth(request) {
  const secret = request.headers.get("x-admin-secret");
  return secret && secret === process.env.ADMIN_SECRET;
}

export async function GET(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await seedIfEmpty();
  const programs = await prisma.program.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(programs);
}

export async function POST(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payload = await request.json();
  const program = await prisma.program.create({ data: payload });
  return NextResponse.json(program);
}
