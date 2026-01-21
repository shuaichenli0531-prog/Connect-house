import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request) {
  const payload = await request.json();
  if (!payload?.name || !payload?.email) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
  const lead = await prisma.lead.create({
    data: {
      name: payload.name,
      role: payload.role || "",
      email: payload.email,
      message: payload.message || "",
    },
  });
  return NextResponse.json(lead);
}
