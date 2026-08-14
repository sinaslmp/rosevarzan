"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Clock, MessageSquareWarning, ShoppingCart, Users, Wallet } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { admin } from "@/lib/api";
import { toToman } from "@/lib/money";

interface Overview {
  userCount: number;
  orderCount: number;
  pendingOrders: number;
  revenue: number;
  unhandledMessages: number;
  lowStockProducts: number;
}

export default function AdminOverviewPage() {
  const t = useTranslations("admin.overview");
  const tCommon = useTranslations("common");
  const format = useFormatter();
  const [data, setData] = useState<Overview | null>(null);

  useEffect(() => {
    admin.overview().then(setData);
  }, []);

  const cards = data
    ? [
        { key: "users", value: format.number(data.userCount), icon: Users },
        { key: "orders", value: format.number(data.orderCount), icon: ShoppingCart },
        { key: "pendingOrders", value: format.number(data.pendingOrders), icon: Clock },
        { key: "revenue", value: `${format.number(toToman(data.revenue))} ${tCommon("toman")}`, icon: Wallet },
        { key: "unhandledMessages", value: format.number(data.unhandledMessages), icon: MessageSquareWarning },
        { key: "lowStock", value: format.number(data.lowStockProducts), icon: AlertTriangle },
      ]
    : [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">{t("title")}</h1>

      {!data ? (
        <p className="mt-6 text-sm text-muted-foreground">{tCommon("loading")}</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {cards.map(({ key, value, icon: Icon }) => (
            <div key={key} className="rounded-2xl border border-border p-5">
              <Icon className="size-5 text-brand" aria-hidden />
              <p className="mt-3 font-heading text-2xl font-semibold text-foreground">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t(key as "users")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
