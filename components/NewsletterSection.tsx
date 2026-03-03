"use client";

import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { useTranslations } from "next-intl";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const t = useTranslations("Newsletter");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-20 md:py-28 bg-brand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-accent text-sm font-medium uppercase tracking-[0.3em]">
              {t("subtitle")}
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white tracking-tight">
              {t("title")}
            </h2>
            <p className="mt-4 text-gray-400 max-w-lg mx-auto">
              {t("description")}
            </p>

            {submitted ? (
              <div className="mt-8 bg-accent/10 border border-accent/30 p-6 text-accent">
                <p className="font-semibold">{t("successTitle")}</p>
                <p className="text-sm mt-1 text-accent/80">
                  {t("successMessage")}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("placeholder")}
                  required
                  className="flex-1 px-4 py-3 bg-white/10 border border-gray-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-accent text-white text-sm font-semibold uppercase tracking-wider hover:bg-accent-light transition-colors"
                >
                  {t("subscribe")}
                </button>
              </form>
            )}

            <p className="mt-4 text-xs text-gray-600">
              {t("disclaimer")}
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
