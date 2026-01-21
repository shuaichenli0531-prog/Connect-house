import { NextResponse } from "next/server";
import { loadSiteContent } from "../../../lib/content-loader";
import { seedIfEmpty } from "../../../lib/seed";

export async function GET() {
  await seedIfEmpty();
  const data = await loadSiteContent();
  return NextResponse.json(data);
}
