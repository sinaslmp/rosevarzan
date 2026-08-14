"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Category } from "@/lib/types";

const CATEGORY_IMAGES: Record<string, string> = {
  "ornamental-flowers": "/farm/rose-garden.jpg",
  "medicinal-edible-plants": "/farm/saffron.jpg",
  "fruit-tree-saplings": "/farm/orchard-blossom.jpg",
};

export function CategoryShowcase({ categories }: { categories: Category[] }) {
  const t = useTranslations("home.categories");
  const locale = useLocale();
  const ArrowIcon = locale === "fa" ? ArrowLeft : ArrowRight;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">{t("eyebrow")}</p>
        <h2 className="mt-2 font-heading text-3xl font-semibold text-foreground">{t("title")}</h2>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href={`/shop?category=${category.slug}`} className="group block overflow-hidden rounded-3xl border border-border">
              <div className="relative aspect-[4/5]">
                <Image
                  src={CATEGORY_IMAGES[category.slug] ?? "/farm/orchard-blossom.jpg"}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-heading text-lg font-semibold text-paper">{locale === "fa" ? category.nameFa : category.nameEn}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-paper/80">{locale === "fa" ? category.descriptionFa : category.descriptionEn}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-paper">
                    {t("viewAll")}
                    <ArrowIcon className="size-3.5 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
