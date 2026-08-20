import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Hero } from "@/components/sections/hero";
import { CategoryShowcase } from "@/components/sections/category-showcase";
import { ProductCard } from "@/components/sections/product-card";
import { TrustSection } from "@/components/sections/trust-section";
import { catalog } from "@/lib/api";
import { cn } from "@/lib/utils";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const [{ categories }, { products: featured }] = await Promise.all([
    catalog.categories(),
    catalog.products({ featured: true }),
  ]);

  return (
    <div>
      <Hero />

      <CategoryShowcase categories={categories} />

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl border-t border-border px-6 py-20 sm:px-8">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">{t("featured.eyebrow")}</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold text-foreground">{t("featured.title")}</h2>
            <p className="mt-2 text-muted-foreground">{t("featured.subtitle")}</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <TrustSection locale={locale} />

      <section className="mx-auto max-w-6xl border-t border-border px-6 py-20 text-center sm:px-8">
        <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">{t("cta.title")}</h2>
        <Link href="/contact" className={cn(buttonVariants({ size: "lg" }), "mt-6 rounded-full px-8")}>
          {t("cta.action")}
        </Link>
      </section>
    </div>
  );
}
