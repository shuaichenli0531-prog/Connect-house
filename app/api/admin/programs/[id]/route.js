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
  const program = await prisma.program.update({
    where: { id: Number(params.id) },
    data: payload,
  });
  return NextResponse.json(program);
}

export async function DELETE(request, { params }) {
  console.log("🗑️ DELETE request for program:", params.id);

  if (!checkAuth(request)) {
    console.log("❌ Unauthorized delete attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = Number(params.id);
    console.log("Deleting program with ID:", id);

    const deleted = await prisma.program.delete({
      where: { id }
    });

    console.log("✅ Program deleted successfully:", deleted);
    return NextResponse.json({ ok: true, deleted });
  } catch (error) {
    console.error("❌ Delete failed:", error);
    return NextResponse.json({
      error: "Delete failed",
      message: error.message
    }, { status: 500 });
  }
}
