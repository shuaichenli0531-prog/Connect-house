import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { seedIfEmpty } from "../../../../lib/seed";

function checkAuth(request) {
  const secret = request.headers.get("x-admin-secret");
  const envSecret = process.env.ADMIN_SECRET;

  console.log("Auth check:");
  console.log("  Received secret:", secret ? `${secret.substring(0, 10)}...` : "NONE");
  console.log("  Expected secret:", envSecret ? `${envSecret.substring(0, 10)}...` : "NOT SET");
  console.log("  Match:", secret === envSecret);

  return secret && secret === envSecret;
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
