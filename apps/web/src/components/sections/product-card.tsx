"use client";

import Image from "next/image";
import { Sprout } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { toToman } from "@/lib/money";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const locale = useLocale();
  const format = useFormatter();
  const t = useTranslations("shop");
  const tCommon = useTranslations("common");
  const name = locale === "fa" ? product.nameFa : product.nameEn;
  const summary = locale === "fa" ? product.summaryFa : product.summaryEn;
  const unit = locale === "fa" ? product.unitFa : product.unitEn;
  const image = product.images[0];

  return (
    <Link href={`/shop/${product.slug}`} className={cn("group block", className)}>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-sage/50">
        {image ? (
          <Image src={image} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex size-full items-center justify-center text-brand/40">
            <Sprout className="size-10" aria-hidden />
          </div>
        )}
        {product.stock <= 0 && (
          <span className="absolute top-3 inset-inline-start-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground">
            {t("outOfStock")}
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        {product.category && (
          <p className="text-xs font-medium text-brand">{locale === "fa" ? product.category.nameFa : product.category.nameEn}</p>
        )}
        <h3 className="text-sm font-semibold text-foreground">{name}</h3>
        <p className="line-clamp-1 text-xs text-muted-foreground">{summary}</p>
        <p className="pt-1 text-sm font-heading font-semibold text-foreground">
          {format.number(toToman(product.price))} {tCommon("toman")}
          <span className="ms-1 text-xs font-sans font-normal text-muted-foreground">{t("perUnit", { unit })}</span>
        </p>
      </div>
    </Link>
  );
}
