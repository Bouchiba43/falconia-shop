import { Metadata } from "next";
import { getProducts, getCategories } from "@/lib/products";
import ShopContent from "./ShopContent";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: t("shopTitle"),
    description: t("shopDescription"),
    openGraph: {
      title: `${t("shopTitle")} | Falconia Shop`,
      description: t("shopDescription"),
    },
  };
}

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ShopPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = await getProducts();
  const categories = await getCategories();
  const t = await getTranslations("Shop");

  return (
    <div className="pt-20 md:pt-24">
      {/* Header */}
      <div className="bg-brand py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-4 text-gray-400 max-w-lg mx-auto">
            {t("description")}
          </p>
        </div>
      </div>

      <ShopContent products={products} categories={categories} />
    </div>
  );
}
