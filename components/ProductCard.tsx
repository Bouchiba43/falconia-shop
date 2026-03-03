import Image from "next/image";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;
  const t = useTranslations("Product");

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <article className="relative">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-surface mb-4">
          <Image
            src={product.images[0] || "/placeholder.jpg"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover product-image-hover group-hover:scale-105 transition-transform duration-500"
          />
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 uppercase tracking-wider">
              -{discountPercent}%
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-sm uppercase tracking-wider">
                {t("soldOut")}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1">
          <p className="text-xs text-muted uppercase tracking-wider">
            {product.category}
          </p>
          <h3 className="text-sm font-medium text-brand group-hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-brand">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted line-through">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
          </div>
          {/* Sizes */}
          <div className="flex flex-wrap gap-1 pt-1">
            {product.sizes.map((size) => (
              <span
                key={size}
                className="text-[10px] text-muted border border-gray-200 px-1.5 py-0.5"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
