import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import { getTranslations } from "next-intl/server";

export default async function AboutSection() {
  const t = await getTranslations("About");

  const features = [
    { icon: "🚚", text: t("delivery") },
    { icon: "✅", text: t("authenticLabel") },
    { icon: "📦", text: t("packaging") },
    { icon: "💬", text: t("support") },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-surface scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Image Side */}
          <AnimatedSection>
            <div className="w-full max-w-sm sm:max-w-md md:max-w-none mx-auto">
              <div className="bg-white border border-gray-200 p-8 sm:p-10">
                <div className="relative aspect-square">
                  <Image
                    src="/logo/logo_falconia.svg"
                    alt="Falconia Shop Logo"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Text Side */}
          <AnimatedSection delay={0.2}>
            <div className="space-y-6">
              <span className="text-accent text-sm font-medium uppercase tracking-[0.3em]">
                {t("subtitle")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand tracking-tight">
                {t("title1")}
                <br />
                {t("title2")}
              </h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>{t("paragraph1")}</p>
                <p>{t("paragraph2")}</p>
                <p>{t("paragraph3")}</p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-6 pt-4">
                {features.map((feature) => (
                  <div key={feature.text} className="flex items-center gap-3">
                    <span className="text-xl">{feature.icon}</span>
                    <span className="text-sm font-medium text-brand">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
