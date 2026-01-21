import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function checkAuth(req) {
  const authHeader = req.headers.get("x-admin-secret");
  const validSecret = process.env.ADMIN_SECRET || "change-me";
  return authHeader === validSecret;
}

export async function PUT(req, { params }) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt(params.id);
  const body = await req.json();

  const event = await prisma.pastEvent.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(event);
}

export async function DELETE(req, { params }) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt(params.id);
  await prisma.pastEvent.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
