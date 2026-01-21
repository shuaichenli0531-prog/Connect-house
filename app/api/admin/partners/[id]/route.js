import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

function checkAuth(request) {
  const secret = request.headers.get("x-admin-secret");
  return secret && secret === process.env.ADMIN_SECRET;
}

export async function PUT(request, { params }) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payload = await request.json();
  const partner = await prisma.partner.update({
    where: { id: Number(params.id) },
    data: payload,
  });
  return NextResponse.json(partner);
}

export async function DELETE(request, { params }) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await prisma.partner.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
