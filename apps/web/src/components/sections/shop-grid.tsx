"use client";

import { useState, useTransition } from "react";
import { Search, Sprout } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/sections/product-card";
import type { Category, Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ShopGrid({
  categories,
  products,
  activeCategory,
  searchQuery,
}: {
  categories: Category[];
  products: Product[];
  activeCategory?: string;
  searchQuery?: string;
}) {
  const t = useTranslations("shop");
  const locale = useLocale();
  const router = useRouter();
  const [search, setSearch] = useState(searchQuery ?? "");
  const [, startTransition] = useTransition();

  function applyFilters(next: { category?: string; search?: string }) {
    const params = new URLSearchParams();
    const category = next.category !== undefined ? next.category : activeCategory;
    const query = next.search !== undefined ? next.search : searchQuery;
    if (category) params.set("category", category);
    if (query) params.set("search", query);
    const qs = params.toString();
    startTransition(() => {
      router.push(`/shop${qs ? `?${qs}` : ""}`);
    });
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyFilters({ category: undefined })}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              !activeCategory ? "border-brand bg-brand text-primary-foreground" : "border-border text-foreground/70 hover:text-foreground",
            )}
          >
            {t("allCategories")}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => applyFilters({ category: category.slug })}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                activeCategory === category.slug ? "border-brand bg-brand text-primary-foreground" : "border-border text-foreground/70 hover:text-foreground",
              )}
            >
              {locale === "fa" ? category.nameFa : category.nameEn}
            </button>
          ))}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            applyFilters({ search });
          }}
          className="relative w-full sm:w-64"
        >
          <Search className="pointer-events-none absolute inset-inline-start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("searchPlaceholder")} className="ps-9" />
        </form>
      </div>

      {products.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center text-muted-foreground">
          <Sprout className="size-8" aria-hidden />
          <p>{t("empty")}</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
