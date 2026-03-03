import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";
import { verifyAuth } from "@/lib/auth";

function revalidateProducts() {
  revalidatePath("/", "layout");
}

// GET all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Failed to read products" },
      { status: 500 }
    );
  }
}

// POST - Add new product
export async function POST(request: NextRequest) {
  const authError = await verifyAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug || generateSlug(body.name),
        price: body.price,
        originalPrice: body.originalPrice || null,
        description: body.description,
        images: body.images || [],
        sizes: body.sizes || [],
        category: body.category,
        featured: body.featured || false,
        inStock: body.inStock ?? true,
      },
    });

    revalidateProducts();
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to add product:", error);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(request: NextRequest) {
  const authError = await verifyAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    const product = await prisma.product.update({
      where: { id: body.id },
      data: {
        name: body.name,
        slug: body.slug || generateSlug(body.name),
        price: body.price,
        originalPrice: body.originalPrice || null,
        description: body.description,
        images: body.images || [],
        sizes: body.sizes || [],
        category: body.category,
        featured: body.featured ?? false,
        inStock: body.inStock ?? true,
      },
    });

    revalidateProducts();
    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  const authError = await verifyAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    await prisma.product.delete({
      where: { id: body.id },
    });

    revalidateProducts();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
