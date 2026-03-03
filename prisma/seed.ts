import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

interface SeedProduct {
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  sizes: string[];
  category: string;
  featured: boolean;
  inStock: boolean;
  createdAt: string;
}

async function main() {
  console.log("🌱 Seeding database...");

  const dataPath = path.join(__dirname, "..", "data", "products.json");
  const raw = fs.readFileSync(dataPath, "utf-8");
  const products: SeedProduct[] = JSON.parse(raw);

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        description: product.description,
        images: product.images,
        sizes: product.sizes,
        category: product.category,
        featured: product.featured,
        inStock: product.inStock,
      },
      create: {
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        description: product.description,
        images: product.images,
        sizes: product.sizes,
        category: product.category,
        featured: product.featured,
        inStock: product.inStock,
        createdAt: new Date(product.createdAt),
      },
    });

    console.log(`  ✅ ${product.name}`);
  }

  console.log(`\n🎉 Seeded ${products.length} products!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
