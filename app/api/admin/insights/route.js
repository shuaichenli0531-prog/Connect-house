import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { seedIfEmpty } from "../../../../lib/seed";
import { getAdminAuthError } from "../../../../lib/admin-auth";

export async function GET(request) {
  const authError = getAdminAuthError(request);
  if (authError) {
    return NextResponse.json(
      { error: authError },
      { status: authError.includes("configured") ? 500 : 401 }
    );
  }

  await seedIfEmpty();
  const insights = await prisma.insight.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(insights);
}

export async function POST(request) {
  const authError = getAdminAuthError(request);
  if (authError) {
    return NextResponse.json(
      { error: authError },
      { status: authError.includes("configured") ? 500 : 401 }
    );
  }
  const payload = await request.json();
  const insight = await prisma.insight.create({ data: payload });
  return NextResponse.json(insight);
}
