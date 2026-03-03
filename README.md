# Falconia Shop 🦅

Premium vintage & streetwear e-commerce website for **Falconia Shop** (@falconia00 on Instagram).

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **TailwindCSS 4**
- **Framer Motion** for animations
- Deployable to **Vercel**

## Features

- ✅ High-converting landing page with Hero, Featured Products, Categories, About, Testimonials, Instagram, Newsletter
- ✅ Full SEO optimization (metadata, sitemap, robots.txt, JSON-LD structured data, OpenGraph, Twitter Cards)
- ✅ Product catalog with filtering and sorting
- ✅ Dynamic product pages with SSG for SEO
- ✅ Admin dashboard for product management (add, edit, delete)
- ✅ WhatsApp order integration
- ✅ Fully responsive design
- ✅ Modern minimal fashion brand aesthetic
- ✅ Smooth animations with Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd falconia_shop

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your production URL | `https://falconia-shop.vercel.app` |
| `ADMIN_PASSWORD` | Admin panel password | `falconia2026` |

## Project Structure

```
├── app/
│   ├── admin/          # Admin dashboard (protected)
│   ├── api/products/   # Products API (CRUD)
│   ├── product/[slug]/ # Dynamic product pages
│   ├── shop/           # Shop listing page
│   ├── layout.tsx      # Root layout with SEO metadata
│   ├── page.tsx        # Landing page
│   ├── sitemap.ts      # Auto-generated sitemap
│   ├── robots.ts       # Robots.txt configuration
│   └── not-found.tsx   # Custom 404 page
├── components/         # Reusable UI components
├── data/
│   └── products.json   # Product data store
├── lib/
│   ├── constants.ts    # Site configuration
│   └── products.ts     # Product utility functions
├── types/
│   └── product.ts      # TypeScript types
└── public/
    ├── logo/           # Brand logo
    └── products/       # Product images
```

## Pages

| Route | Description |
|---|---|
| `/` | Landing page with all sections |
| `/shop` | Product catalog with filters |
| `/product/[slug]` | Individual product page |
| `/admin` | Admin dashboard (password protected) |

## Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SITE_URL` → your Vercel domain
   - `ADMIN_PASSWORD` → your secure admin password
5. Deploy!

> **Note:** The admin product management uses the local filesystem for storage. For production, consider migrating to a database (e.g., Supabase, PlanetScale) or a headless CMS.

## Future Enhancements

- [ ] Payment integration (Stripe, Flouci for Tunisia)
- [ ] User authentication
- [ ] Shopping cart & checkout
- [ ] Order management system
- [ ] Image upload in admin
- [ ] Database migration (Supabase/PlanetScale)
- [ ] Email notifications
- [ ] Analytics integration

## License

Private — Falconia Shop © 2026
