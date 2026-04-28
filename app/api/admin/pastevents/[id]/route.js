import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getAdminAuthError } from "../../../../../lib/admin-auth";

function normalizePastEventPayload(payload) {
  const {
    descriptionEn,
    descriptionZh,
    ...rest
  } = payload;

  return {
    ...rest,
    descEn: payload.descEn ?? descriptionEn ?? "",
    descZh: payload.descZh ?? descriptionZh ?? "",
  };
}

export async function PUT(req, { params }) {
  const authError = getAdminAuthError(req);
  if (authError) {
    return NextResponse.json(
      { error: authError },
      { status: authError.includes("configured") ? 500 : 401 }
    );
  }

  const id = parseInt(params.id);
  const body = await req.json();

  const event = await prisma.pastEvent.update({
    where: { id },
    data: normalizePastEventPayload(body),
  });

  return NextResponse.json(event);
}

export async function DELETE(req, { params }) {
  const authError = getAdminAuthError(req);
  if (authError) {
    return NextResponse.json(
      { error: authError },
      { status: authError.includes("configured") ? 500 : 401 }
    );
  }

  const id = parseInt(params.id);
  await prisma.pastEvent.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
