"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { INSTAGRAM_URL, PHONE_NUMBER } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface ProductDetailsProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetails({
  product,
  relatedProducts,
}: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [showMessage, setShowMessage] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const t = useTranslations("Product");

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;

  const handleOrder = () => {
    if (!selectedSize) {
      setShowSizeModal(true);
      return;
    }
    const message = encodeURIComponent(
      t("orderMessage", {
        name: product.name,
        size: selectedSize,
        price: formatPrice(product.price),
      })
    );
    window.open(
      `https://wa.me/216${PHONE_NUMBER}?text=${message}`,
      "_blank"
    );
  };

  return (
    <div className="pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted mb-8">
          <Link href="/" className="hover:text-brand transition-colors">
            {t("home")}
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand transition-colors">
            {t("shop")}
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.category}`}
            className="hover:text-brand transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-brand">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Product Image */}
          <div className="relative aspect-[3/4] bg-surface overflow-hidden">
            <Image
              src={product.images[0] || "/placeholder.jpg"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1">
                {t("sale")}
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <p className="text-sm text-muted uppercase tracking-wider mb-2">
                {product.category}
              </p>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl md:text-3xl font-bold text-brand">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-muted line-through">
                  {formatPrice(product.originalPrice!)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted leading-relaxed">{product.description}</p>

            {/* Sizes */}
            <div>
              <p className="text-sm font-semibold text-brand mb-3 uppercase tracking-wider">
                {t("size")}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-12 px-4 text-sm font-medium border transition-all ${
                      selectedSize === size
                        ? "bg-brand text-white border-brand"
                        : "bg-white text-brand border-gray-200 hover:border-brand"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.inStock ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-muted">
                {product.inStock ? t("inStock") : t("soldOut")}
              </span>
            </div>

            {/* Order Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleOrder}
                disabled={!product.inStock}
                className="flex-1 bg-brand text-white py-4 text-sm font-semibold uppercase tracking-wider hover:bg-brand-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.inStock ? t("orderWhatsApp") : t("soldOut")}
              </button>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 border border-brand text-brand py-4 text-sm font-semibold uppercase tracking-wider text-center hover:bg-brand hover:text-white transition-colors"
              >
                {t("messageInstagram")}
              </a>
            </div>

            {showMessage && (
              <div className="bg-green-50 border border-green-200 p-4 text-green-700 text-sm">
                {t("orderSent")}
              </div>
            )}

            {/* Features */}
            <div className="border-t border-gray-100 pt-6 space-y-3">
              {[
                t("deliveryFeature"),
                t("authenticFeature"),
                t("packagingFeature"),
                t("supportFeature"),
              ].map((feature) => (
                <p key={feature} className="text-sm text-muted">
                  {feature}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-brand mb-8">
              {t("relatedProducts")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Selection Modal */}
      {showSizeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowSizeModal(false)}
        >
          <div
            className="bg-white max-w-sm w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-brand">{t("selectSize")}</h3>
            </div>
            <p className="text-sm text-muted mb-6">
              {t("selectSizeDesc")}
            </p>
            <button
              onClick={() => setShowSizeModal(false)}
              className="w-full bg-brand text-white py-3 text-sm font-semibold uppercase tracking-wider hover:bg-brand-light transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
