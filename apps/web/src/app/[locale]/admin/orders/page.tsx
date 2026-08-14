"use client";

import { useEffect, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { admin } from "@/lib/api";
import { toToman } from "@/lib/money";
import type { AuthUser, Order, OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = ["PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export default function AdminOrdersPage() {
  const t = useTranslations("admin.orders");
  const tStatus = useTranslations("account.status");
  const tCommon = useTranslations("common");
  const format = useFormatter();
  const [orders, setOrders] = useState<(Order & { user: AuthUser | null })[]>([]);

  function load() {
    admin.orders().then((res) => setOrders(res.orders));
  }

  useEffect(load, []);

  async function updateStatus(id: string, status: OrderStatus) {
    try {
      await admin.updateOrderStatus(id, status);
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : tCommon("error"));
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">{t("title")}</h1>

      <ul className="mt-6 divide-y divide-border rounded-2xl border border-border">
        {orders.map((order) => (
          <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-foreground" dir="ltr">{order.orderNumber}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {order.contactName} · {format.dateTime(new Date(order.createdAt), { dateStyle: "medium" })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground">
                {format.number(toToman(order.total))} {tCommon("toman")}
              </span>
              <Select value={order.status} onValueChange={(value) => updateStatus(order.id, value as OrderStatus)}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {tStatus(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
