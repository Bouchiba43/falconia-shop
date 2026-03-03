/**
 * Server-only data access layer.
 * Do NOT import this file in client components.
 */
import { prisma } from "@/lib/prisma";
import type { Product } from "@/lib/generated/prisma/client";

export type { Product };

export async function getProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return prisma.product.findUnique({
    where: { slug },
  });
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  return prisma.product.findMany({
    where: { category: { equals: category, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCategories(): Promise<string[]> {
  const products = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
  });
  return products.map((p) => p.category);
}
