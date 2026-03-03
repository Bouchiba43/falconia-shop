import { NextRequest, NextResponse } from "next/server";
import { getImageStream } from "@/lib/b2";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key } = await params;
    const imageKey = key.join("/");

    const { body, contentType } = await getImageStream(imageKey);

    if (!body) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const bytes = await body.transformToByteArray();
    const buffer = Buffer.from(bytes);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
