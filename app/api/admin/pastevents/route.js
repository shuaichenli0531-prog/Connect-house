import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function checkAuth(req) {
  const authHeader = req.headers.get("x-admin-secret");
  const validSecret = process.env.ADMIN_SECRET || "change-me";
  return authHeader === validSecret;
}

export async function GET(req) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await prisma.pastEvent.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(events);
}

export async function POST(req) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const event = await prisma.pastEvent.create({ data: body });

  return NextResponse.json(event);
}
