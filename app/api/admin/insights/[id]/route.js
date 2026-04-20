import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getAdminAuthError } from "../../../../../lib/admin-auth";

export async function PUT(request, { params }) {
  const authError = getAdminAuthError(request);
  if (authError) {
    return NextResponse.json(
      { error: authError },
      { status: authError.includes("configured") ? 500 : 401 }
    );
  }
  const payload = await request.json();
  const insight = await prisma.insight.update({
    where: { id: Number(params.id) },
    data: payload,
  });
  return NextResponse.json(insight);
}

export async function DELETE(request, { params }) {
  const authError = getAdminAuthError(request);
  if (authError) {
    return NextResponse.json(
      { error: authError },
      { status: authError.includes("configured") ? 500 : 401 }
    );
  }
  await prisma.insight.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
