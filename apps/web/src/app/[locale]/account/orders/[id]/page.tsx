"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, PackageOpen } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/context/auth-context";
import { Link, useRouter } from "@/i18n/navigation";
import { orders as ordersApi } from "@/lib/api";
import { toToman } from "@/lib/money";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types";

export default function OrderDetailPage() {
  const t = useTranslations("account");
  const tCheckout = useTranslations("checkout");
  const tCommon = useTranslations("common");
  const format = useFormatter();
  const locale = useLocale();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [order, setOrder] = useState<Order | null | "not-found">(null);
  const BackIcon = locale === "fa" ? ArrowRight : ArrowLeft;

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/sign-in");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || !params.id) return;
    ordersApi.get(params.id).then(
      (res) => setOrder(res.order),
      () => setOrder("not-found"),
    );
  }, [user, params.id]);

  if (loading || !user) return null;

  const latestPayment = order && order !== "not-found" ? order.payments[order.payments.length - 1] : undefined;

  return (
    <div className="mx-auto max-w-3xl px-6 py-14 sm:px-8">
      <Link href="/account" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <BackIcon className="size-3.5" aria-hidden />
        {t("backToOrders")}
      </Link>

      {order === null ? (
        <p className="mt-6 text-sm text-muted-foreground">{tCommon("loading")}</p>
      ) : order === "not-found" ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-14 text-center text-muted-foreground">
          <PackageOpen className="size-8" aria-hidden />
          <p>{tCommon("error")}</p>
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-heading text-2xl font-semibold text-foreground" dir="ltr">
                {order.orderNumber}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{format.dateTime(new Date(order.createdAt), { dateStyle: "medium", timeStyle: "short" })}</p>
            </div>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">{t(`status.${order.status as OrderStatus}`)}</span>
          </div>

          <div className="mt-8">
            <h2 className="text-sm font-semibold text-foreground">{t("orderDetail.itemsTitle")}</h2>
            <ul className="mt-3 divide-y divide-border rounded-2xl border border-border">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                  <span className="text-foreground">{locale === "fa" ? item.nameFa : item.nameEn}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {format.number(item.quantity)} × {format.number(toToman(item.unitPrice))} {tCommon("toman")}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 space-y-2 rounded-2xl border border-border p-5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>{tCheckout("subtotal")}</span>
              <span>
                {format.number(toToman(order.subtotal))} {tCommon("toman")}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>{tCheckout("shipping")}</span>
              <span>{order.shippingCost > 0 ? `${format.number(toToman(order.shippingCost))} ${tCommon("toman")}` : tCheckout("shippingFree")}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-heading text-base font-semibold text-foreground">
              <span>{tCheckout("total")}</span>
              <span>
                {format.number(toToman(order.total))} {tCommon("toman")}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold text-foreground">{tCheckout("shippingTitle")}</h2>
              <dl className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                <div>
                  <dt className="inline text-foreground">{order.contactName}</dt>
                </div>
                <div dir="ltr" className="text-end">
                  {order.contactPhone}
                </div>
                <div>
                  {order.province}، {order.city}
                </div>
                <div>{order.addressLine}</div>
                {order.postalCode && <div dir="ltr">{order.postalCode}</div>}
              </dl>
            </div>

            {latestPayment && (
              <div>
                <h2 className="text-sm font-semibold text-foreground">{t("orderDetail.paymentTitle")}</h2>
                <dl className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  <div>{t(`paymentStatus.${latestPayment.status as PaymentStatus}`)}</div>
                  {latestPayment.refId && (
                    <div dir="ltr">
                      {t("orderDetail.refId")}: {latestPayment.refId}
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
