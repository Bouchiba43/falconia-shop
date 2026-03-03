"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useTransition } from "react";

const localeLabels: Record<string, string> = {
  en: "EN",
  fr: "FR",
  ar: "عربي",
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale as "en" | "fr" | "ar" });
    });
  };

  return (
    <div className="relative flex items-center gap-1">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleChange(loc)}
          disabled={isPending}
          className={`px-2 py-1 text-xs font-medium uppercase tracking-wider transition-colors ${
            locale === loc
              ? "bg-brand text-white"
              : "text-gray-500 hover:text-brand"
          } ${isPending ? "opacity-50" : ""}`}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  );
}
