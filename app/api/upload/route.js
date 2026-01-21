import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request) {
  try {
    console.log("🔵 Upload started");
    console.log("Environment:", process.env.NODE_ENV);
    console.log("BLOB_READ_WRITE_TOKEN exists:", !!process.env.BLOB_READ_WRITE_TOKEN);

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      console.log("❌ No file in request");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("📁 File info:", {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // 检查文件大小 (限制 5MB for Vercel Blob)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      console.log("❌ File too large:", file.size);
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // 检查文件类型
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      console.log("❌ Invalid file type:", file.type);
      return NextResponse.json(
        { error: "Only image files (JPEG, PNG, WebP, GIF) are allowed" },
        { status: 400 }
      );
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `uploads/${timestamp}-${originalName}`;

    console.log("📤 Uploading to Vercel Blob:", filename);

    // Upload to Vercel Blob Storage
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    console.log("✅ Upload successful:", blob.url);

    // Return the Vercel Blob URL
    return NextResponse.json({
      url: blob.url,
      filename: filename
    });
  } catch (error) {
    console.error("❌ Upload error:");
    console.error("  Message:", error.message);
    console.error("  Stack:", error.stack);
    console.error("  Full error:", error);

    return NextResponse.json(
      {
        error: "Failed to upload file",
        details: error.message,
        hasToken: !!process.env.BLOB_READ_WRITE_TOKEN
      },
      { status: 500 }
    );
  }
}
