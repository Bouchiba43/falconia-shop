import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="min-h-screen flex items-center justify-center bg-white pt-20">
      <div className="text-center px-4">
        <h1 className="text-7xl md:text-9xl font-bold text-brand/10">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-brand mt-4">
          {t("title")}
        </h2>
        <p className="text-muted mt-3 max-w-md mx-auto">
          {t("description")}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-brand text-white text-sm font-semibold uppercase tracking-wider hover:bg-brand-light transition-colors"
          >
            {t("goHome")}
          </Link>
          <Link
            href="/shop"
            className="px-8 py-3 border border-brand text-brand text-sm font-semibold uppercase tracking-wider hover:bg-brand hover:text-white transition-colors"
          >
            {t("browseShop")}
          </Link>
        </div>
      </div>
    </div>
  );
}
