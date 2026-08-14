"use client";

import { useState } from "react";
import Image from "next/image";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";

export function CartSheet() {
  const tCart = useTranslations("cart");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const format = useFormatter();
  const { items, count, subtotal, setQuantity, removeItem } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button
            type="button"
            className="relative flex size-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
            aria-label={tCart("title")}
          />
        }
      >
        <ShoppingBag className="size-4" aria-hidden />
        {count > 0 && (
          <span className="absolute -top-1 -end-1 flex size-4 items-center justify-center rounded-full bg-rose text-[10px] font-semibold text-rose-soft">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </SheetTrigger>

      <SheetContent side={locale === "fa" ? "left" : "right"} className="flex w-full flex-col sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>{tCart("title")}</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-muted-foreground">{tCart("empty")}</div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4">
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-sage/60">
                    {item.image ? (
                      <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
                    ) : (
                      <div className="flex size-full items-center justify-center text-brand/50">
                        <ShoppingBag className="size-6" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{locale === "fa" ? item.nameFa : item.nameEn}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {format.number(item.price)} {tCommon("toman")}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button type="button" variant="outline" size="icon-xs" className="rounded-full" onClick={() => setQuantity(item.productId, item.quantity - 1)} aria-label="-">
                        <Minus className="size-3" aria-hidden />
                      </Button>
                      <span className="w-5 text-center text-xs font-medium text-foreground">{format.number(item.quantity)}</span>
                      <Button type="button" variant="outline" size="icon-xs" className="rounded-full" onClick={() => setQuantity(item.productId, item.quantity + 1)} aria-label="+">
                        <Plus className="size-3" aria-hidden />
                      </Button>
                      <button type="button" onClick={() => removeItem(item.productId)} className="ms-auto text-xs text-muted-foreground hover:text-destructive">
                        {tCart("remove")}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {items.length > 0 && (
          <SheetFooter className="border-t border-border">
            <div className="flex w-full items-center justify-between text-sm">
              <span className="text-muted-foreground">{tCart("subtotal")}</span>
              <span className="font-heading font-semibold text-foreground">
                {format.number(subtotal)} {tCommon("toman")}
              </span>
            </div>
            <div className="mt-1 flex w-full gap-2">
              <Link href="/cart" onClick={() => setOpen(false)} className={cn(buttonVariants({ variant: "outline" }), "flex-1 rounded-full")}>
                {tCart("title")}
              </Link>
              <Link href="/checkout" onClick={() => setOpen(false)} className={cn(buttonVariants(), "flex-1 rounded-full")}>
                {tCart("checkout")}
              </Link>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
