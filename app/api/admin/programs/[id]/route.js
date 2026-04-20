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
  const program = await prisma.program.update({
    where: { id: Number(params.id) },
    data: payload,
  });
  return NextResponse.json(program);
}

export async function DELETE(request, { params }) {
  const authError = getAdminAuthError(request);
  if (authError) {
    return NextResponse.json(
      { error: authError },
      { status: authError.includes("configured") ? 500 : 401 }
    );
  }

  try {
    const id = Number(params.id);

    const deleted = await prisma.program.delete({
      where: { id }
    });

    return NextResponse.json({ ok: true, deleted });
  } catch (error) {
    return NextResponse.json({
      error: "Delete failed",
      message: error.message
    }, { status: 500 });
  }
}
