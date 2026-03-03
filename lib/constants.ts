export const SITE_NAME = "Falconia Shop";
export const SITE_DESCRIPTION =
  "Premium vintage & streetwear clothing. Curated fashion pieces delivered across Tunisia. Shop hoodies, jackets, tees & more.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://falconia-shop.vercel.app";
export const INSTAGRAM_URL = "https://www.instagram.com/falconia00/";
export const PHONE_NUMBER = "53079068";
export const LOCATION = "Gafsa, Tunisia";
export const BRAND_TAGLINE = "Curated Streetwear. Delivered to Your Door.";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

export const CATEGORIES = [
  "Jackets",
  "Hoodies",
  "T-Shirts",
  "Pants",
] as const;

