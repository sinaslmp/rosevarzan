"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/lib/types";

export function AddToCartForm({ product }: { product: Product }) {
  const t = useTranslations("product");
  const locale = useLocale();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    addItem(product, quantity);
    toast.success(t("added"), { description: locale === "fa" ? product.nameFa : product.nameEn });
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 rounded-full border border-border p-1">
        <Button type="button" variant="ghost" size="icon-sm" className="rounded-full" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="-">
          <Minus className="size-3.5" aria-hidden />
        </Button>
        <span className="w-6 text-center text-sm font-medium text-foreground">{quantity}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          aria-label="+"
        >
          <Plus className="size-3.5" aria-hidden />
        </Button>
      </div>
      <Button type="button" size="lg" className="flex-1 rounded-full" disabled={outOfStock} onClick={handleAdd}>
        <ShoppingBag className="size-4" aria-hidden />
        {t("addToCart")}
      </Button>
    </div>
  );
}
