import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "Upload API is running",
    environment: process.env.NODE_ENV,
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    blobTokenPrefix: process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 20) + "...",
  });
}
