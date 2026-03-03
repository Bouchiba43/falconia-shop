import { NextRequest, NextResponse } from "next/server";
import { uploadToB2, deleteFromB2 } from "@/lib/b2";
import { verifyAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const authError = await verifyAuth(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadToB2(file);
      urls.push(url);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await verifyAuth(request);
  if (authError) return authError;

  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    await deleteFromB2(url);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
