import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import { getFeaturedProducts } from "@/lib/products";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function FeaturedProducts() {
  const products = (await getFeaturedProducts()).slice(0, 4);
  const t = await getTranslations("FeaturedProducts");

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-14">
            <span className="text-accent text-sm font-medium uppercase tracking-[0.3em]">
              {t("subtitle")}
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-brand tracking-tight">
              {t("title")}
            </h2>
            <p className="mt-4 text-muted max-w-lg mx-auto">
              {t("description")}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand hover:text-accent transition-colors border-b-2 border-brand hover:border-accent pb-1"
            >
              {t("viewAll")}
              <svg
                className="w-4 h-4 rtl:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
