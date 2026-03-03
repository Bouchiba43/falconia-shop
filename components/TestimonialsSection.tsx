import AnimatedSection from "@/components/AnimatedSection";
import { getTranslations } from "next-intl/server";

export default async function TestimonialsSection() {
  const t = await getTranslations("Testimonials");

  const testimonials = [
    {
      id: 1,
      name: "Ahmed B.",
      location: "Tunis",
      text: t("testimonial1"),
      rating: 5,
    },
    {
      id: 2,
      name: "Yassine M.",
      location: "Sfax",
      text: t("testimonial2"),
      rating: 5,
    },
    {
      id: 3,
      name: "Sami K.",
      location: "Sousse",
      text: t("testimonial3"),
      rating: 5,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-surface">
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
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-accent"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-muted text-sm leading-relaxed mb-6">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
