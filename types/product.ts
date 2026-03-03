export type { Product } from "@/lib/generated/prisma/browser";

export interface ProductFormData {
  name: string;
  price: number;
  originalPrice?: number | null;
  description: string;
  images: string[];
  sizes: string[];
  category: string;
  featured: boolean;
  inStock: boolean;
}
