import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function CategoriesSection() {
  const t = await getTranslations("Categories");

  const categories = [
    {
      name: t("jackets"),
      filterName: "Jackets",
      description: t("jacketsDesc"),
      image: "/categories/falconia_jackets.jpg",
    },
    {
      name: t("hoodies"),
      filterName: "Hoodies",
      description: t("hoodiesDesc"),
      image: "/categories/falconia_hoodies.jpg",
    },
    {
      name: t("tshirts"),
      filterName: "T-Shirts",
      description: t("tshirtsDesc"),
      image: "/categories/falconia_tshirts.jpg",
    },
    {
      name: t("pants"),
      filterName: "Pants",
      description: t("pantsDesc"),
      image: "/categories/falconia_pants.jpg",
    },
  ];

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
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.filterName}
                href={`/shop?category=${category.filterName}`}
                className="group relative aspect-[3/4] overflow-hidden"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-colors duration-300" />
                <div className="relative h-full flex flex-col items-center justify-center text-white text-center p-4">
                  <h3 className="text-lg md:text-xl font-bold uppercase tracking-wider">
                    {category.name}
                  </h3>
                  <p className="text-xs text-white/70 mt-1">
                    {category.description}
                  </p>
                  <span className="mt-4 text-xs uppercase tracking-widest border border-white/50 px-4 py-1.5 group-hover:bg-white group-hover:text-brand transition-all duration-300">
                    {t("explore")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
