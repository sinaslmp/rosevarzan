import { getTranslations, setRequestLocale } from "next-intl/server";
import { catalog } from "@/lib/api";
import { ShopGrid } from "@/components/sections/shop-grid";

export default async function ShopPage({
  params,
  searchParams,
}: PageProps<"/[locale]/shop">) {
  const { locale } = await params;
  const { category, search } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("shop");

  const categorySlug = typeof category === "string" ? category : undefined;
  const searchQuery = typeof search === "string" ? search : undefined;

  const [{ categories }, { products }] = await Promise.all([
    catalog.categories(),
    catalog.products({ category: categorySlug, search: searchQuery }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8">
      <div className="max-w-2xl">
        <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <ShopGrid categories={categories} products={products} activeCategory={categorySlug} searchQuery={searchQuery} />
    </div>
  );
}
