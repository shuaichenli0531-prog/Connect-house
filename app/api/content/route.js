import { NextResponse } from "next/server";
import { loadSiteContent } from "../../../lib/content-loader";
import { seedIfEmpty } from "../../../lib/seed";

// Mark as dynamic route to prevent static generation at build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  await seedIfEmpty();
  const data = await loadSiteContent();
  return NextResponse.json(data);
}
