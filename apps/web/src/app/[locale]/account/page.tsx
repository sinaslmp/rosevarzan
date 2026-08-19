"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, PackageOpen } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/context/auth-context";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { account } from "@/lib/api";
import { toToman } from "@/lib/money";
import type { Order, OrderStatus } from "@/lib/types";

export default function AccountPage() {
  const t = useTranslations("account");
  const tCommon = useTranslations("common");
  const format = useFormatter();
  const locale = useLocale();
  const ChevronIcon = locale === "fa" ? ChevronLeft : ChevronRight;
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/sign-in");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    account.orders().then((res) => setOrders(res.orders));
  }, [user]);

  if (loading || !user) return null;

  async function handleSignOut() {
    await logout();
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-14 sm:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-foreground">{t("title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("welcome", { name: user.fullName })}</p>
        </div>
        <Button type="button" variant="outline" className="rounded-full" onClick={handleSignOut}>
          {t("signOut")}
        </Button>
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-semibold text-foreground">{t("ordersTitle")}</h2>

        {orders === null ? (
          <p className="mt-4 text-sm text-muted-foreground">{tCommon("loading")}</p>
        ) : orders.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-14 text-center text-muted-foreground">
            <PackageOpen className="size-8" aria-hidden />
            <p>{t("ordersEmpty")}</p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-border rounded-2xl border border-border">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground" dir="ltr">
                      {order.orderNumber}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{format.dateTime(new Date(order.createdAt), { dateStyle: "medium" })}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-foreground">
                      {format.number(toToman(order.total))} {tCommon("toman")}
                    </span>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                      {t(`status.${order.status as OrderStatus}`)}
                    </span>
                    <ChevronIcon className="size-4 text-muted-foreground" aria-hidden />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
