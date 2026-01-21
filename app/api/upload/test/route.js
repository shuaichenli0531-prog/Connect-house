import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  return NextResponse.json({
    status: "Upload API is running",
    environment: process.env.NODE_ENV,
    hasBlobToken: !!token,
    blobTokenPrefix: token ? token.substring(0, 30) + "..." : "NOT SET",
    envVars: Object.keys(process.env).filter(k => k.includes('BLOB')),
  });
}
