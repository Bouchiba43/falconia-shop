/**
 * Client-safe utility functions.
 * These can be imported in both server and client components.
 */

export function formatPrice(price: number): string {
  return `${price} TND`;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
