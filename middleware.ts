import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except for:
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /_vercel (Vercel internals)
    // - /admin (admin panel - no i18n)
    // - Static files (e.g. /favicon.ico, /logo/*, etc.)
    "/((?!api|_next|_vercel|admin|.*\\..*).*)",
  ],
};
