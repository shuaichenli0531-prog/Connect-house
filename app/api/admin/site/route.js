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
  const site = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  return NextResponse.json(site);
}

export async function PUT(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payload = await request.json();
  const site = await prisma.siteConfig.update({
    where: { id: 1 },
    data: payload,
  });
  return NextResponse.json(site);
}
