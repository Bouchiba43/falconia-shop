"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { useTranslations } from "next-intl";

interface ShopContentProps {
  products: Product[];
  categories: string[];
}

export default function ShopContent({ products, categories }: ShopContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("newest");
  const t = useTranslations("Shop");

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return filtered;
  }, [products, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-100">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${
              selectedCategory === "All"
                ? "bg-brand text-white"
                : "bg-surface text-muted hover:bg-surface-dark"
            }`}
          >
            {t("all")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${
                selectedCategory === cat
                  ? "bg-brand text-white"
                  : "bg-surface text-muted hover:bg-surface-dark"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 text-xs font-medium uppercase tracking-wider bg-surface text-muted border-0 focus:outline-none cursor-pointer"
        >
          <option value="newest">{t("newestFirst")}</option>
          <option value="price-asc">{t("priceLowHigh")}</option>
          <option value="price-desc">{t("priceHighLow")}</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted mb-6">
        {t("productCount", { count: filteredProducts.length })}
      </p>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted text-lg">{t("noProducts")}</p>
          <button
            onClick={() => setSelectedCategory("All")}
            className="mt-4 text-accent hover:underline text-sm font-medium"
          >
            {t("viewAll")}
          </button>
        </div>
      )}
    </div>
  );
}
