import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getAdminAuthError } from "../../../../lib/admin-auth";

export async function GET(req) {
  const authError = getAdminAuthError(req);
  if (authError) {
    return NextResponse.json(
      { error: authError },
      { status: authError.includes("configured") ? 500 : 401 }
    );
  }

  const events = await prisma.pastEvent.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(events);
}

export async function POST(req) {
  const authError = getAdminAuthError(req);
  if (authError) {
    return NextResponse.json(
      { error: authError },
      { status: authError.includes("configured") ? 500 : 401 }
    );
  }

  const body = await req.json();
  const event = await prisma.pastEvent.create({ data: body });

  return NextResponse.json(event);
}
