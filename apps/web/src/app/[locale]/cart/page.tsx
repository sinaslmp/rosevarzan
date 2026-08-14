"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useMounted } from "@/hooks/use-mounted";
import { toToman } from "@/lib/money";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const format = useFormatter();
  const mounted = useMounted();
  const { items, subtotal, setQuantity, removeItem } = useCart();

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-14 sm:px-8">
      <h1 className="font-heading text-3xl font-semibold text-foreground">{t("title")}</h1>

      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <ShoppingBag className="size-10 text-muted-foreground" aria-hidden />
          <p className="text-muted-foreground">{t("empty")}</p>
          <Link href="/shop" className={cn(buttonVariants(), "rounded-full")}>
            {t("emptyCta")}
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-4 py-5">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-sage/50">
                  {item.image ? (
                    <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center text-brand/40">
                      <ShoppingBag className="size-6" aria-hidden />
                    </div>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <Link href={`/shop/${item.slug}`} className="text-sm font-medium text-foreground hover:underline">
                      {locale === "fa" ? item.nameFa : item.nameEn}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {format.number(toToman(item.price))} {tCommon("toman")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="icon-xs" className="rounded-full" onClick={() => setQuantity(item.productId, item.quantity - 1)} aria-label="-">
                      <Minus className="size-3" aria-hidden />
                    </Button>
                    <span className="w-6 text-center text-xs font-medium text-foreground">{format.number(item.quantity)}</span>
                    <Button type="button" variant="outline" size="icon-xs" className="rounded-full" onClick={() => setQuantity(item.productId, item.quantity + 1)} aria-label="+">
                      <Plus className="size-3" aria-hidden />
                    </Button>
                    <button type="button" onClick={() => removeItem(item.productId)} className="ms-auto text-xs text-muted-foreground hover:text-destructive">
                      {t("remove")}
                    </button>
                  </div>
                </div>
                <p className="shrink-0 self-start font-heading text-sm font-semibold text-foreground">
                  {format.number(toToman(item.lineTotal))} {tCommon("toman")}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
            <span className="text-sm text-muted-foreground">{t("subtotal")}</span>
            <span className="font-heading text-lg font-semibold text-foreground">
              {format.number(toToman(subtotal))} {tCommon("toman")}
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className={cn(buttonVariants({ variant: "outline" }), "flex-1 rounded-full")}>
              {t("continueShopping")}
            </Link>
            <Link href="/checkout" className={cn(buttonVariants(), "flex-1 rounded-full")}>
              {t("checkout")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
