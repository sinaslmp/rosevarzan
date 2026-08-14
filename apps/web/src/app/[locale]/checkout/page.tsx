"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoaderCircle, ShoppingBag } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useMounted } from "@/hooks/use-mounted";
import { ApiError, orders, payments } from "@/lib/api";
import { createCheckoutSchema, type CheckoutFormValues } from "@/lib/checkout-schema";
import { toToman } from "@/lib/money";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const format = useFormatter();
  const mounted = useMounted();
  const { user } = useAuth();
  const { items, subtotal, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      createCheckoutSchema({
        nameRequired: t("validation.nameRequired"),
        phoneRequired: t("validation.phoneRequired"),
        cityRequired: t("validation.cityRequired"),
        addressRequired: t("validation.addressRequired"),
      }),
    [t],
  );

  const formValues = useMemo(
    () => ({ contactName: user?.fullName ?? "", contactPhone: user?.phone ?? "", province: "", city: "", addressLine: "", postalCode: "", note: "" }),
    [user],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({ resolver: zodResolver(schema), values: formValues, resetOptions: { keepDirtyValues: true } });

  async function onSubmit(values: CheckoutFormValues) {
    setSubmitting(true);
    setError(null);
    try {
      const { order } = await orders.create({
        ...values,
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      });
      clear();
      const { gatewayUrl } = await payments.request(order.id);
      window.location.href = gatewayUrl;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("error"));
      setSubmitting(false);
    }
  }

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center sm:px-8">
        <ShoppingBag className="mx-auto size-10 text-muted-foreground" aria-hidden />
        <h1 className="mt-5 font-heading text-xl font-semibold text-foreground">{t("emptyTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("emptyBody")}</p>
        <Link href="/shop" className={cn(buttonVariants({ size: "lg" }), "mt-6 rounded-full")}>
          {t("emptyCta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8">
      <h1 className="font-heading text-3xl font-semibold text-foreground">{t("title")}</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <h2 className="text-sm font-semibold text-foreground">{t("shippingTitle")}</h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="contactName">{t("contactName")}</Label>
              <Input id="contactName" {...register("contactName")} aria-invalid={!!errors.contactName} />
              {errors.contactName && <p className="text-xs text-destructive">{errors.contactName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contactPhone">{t("contactPhone")}</Label>
              <Input id="contactPhone" dir="ltr" {...register("contactPhone")} aria-invalid={!!errors.contactPhone} />
              {errors.contactPhone && <p className="text-xs text-destructive">{errors.contactPhone.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="province">{t("province")}</Label>
              <Input id="province" {...register("province")} aria-invalid={!!errors.province} />
              {errors.province && <p className="text-xs text-destructive">{errors.province.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">{t("city")}</Label>
              <Input id="city" {...register("city")} aria-invalid={!!errors.city} />
              {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addressLine">{t("addressLine")}</Label>
            <Textarea id="addressLine" rows={3} {...register("addressLine")} aria-invalid={!!errors.addressLine} />
            {errors.addressLine && <p className="text-xs text-destructive">{errors.addressLine.message}</p>}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="postalCode">{t("postalCode")}</Label>
              <Input id="postalCode" dir="ltr" {...register("postalCode")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note">{t("note")}</Label>
            <Textarea id="note" rows={2} {...register("note")} />
          </div>
        </div>

        <div className="h-fit rounded-2xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground">{t("summaryTitle")}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-3 text-muted-foreground">
                <span className="truncate">
                  {locale === "fa" ? item.nameFa : item.nameEn} × {format.number(item.quantity)}
                </span>
                <span className="shrink-0 text-foreground">
                  {format.number(toToman(item.lineTotal))} {tCommon("toman")}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>{t("subtotal")}</span>
              <span>
                {format.number(toToman(subtotal))} {tCommon("toman")}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>{t("shipping")}</span>
              <span>{t("shippingFree")}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-heading text-base font-semibold text-foreground">
              <span>{t("total")}</span>
              <span>
                {format.number(toToman(subtotal))} {tCommon("toman")}
              </span>
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          <Button type="submit" size="lg" className="mt-5 w-full rounded-full" disabled={submitting}>
            {submitting && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
            {submitting ? t("submitting") : t("submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}
