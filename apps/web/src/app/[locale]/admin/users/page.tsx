"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { admin } from "@/lib/api";
import type { AuthUser } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const t = useTranslations("admin.users");
  const tCommon = useTranslations("common");
  const [users, setUsers] = useState<(AuthUser & { active: boolean })[]>([]);

  function load() {
    admin.users().then((res) => setUsers(res.users as (AuthUser & { active: boolean })[]));
  }

  useEffect(load, []);

  async function toggleRole(user: AuthUser) {
    try {
      await admin.updateUser(user.id, { role: user.role === "ADMIN" ? "USER" : "ADMIN" });
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : tCommon("error"));
    }
  }

  async function toggleActive(user: AuthUser & { active: boolean }) {
    try {
      await admin.updateUser(user.id, { active: !user.active });
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : tCommon("error"));
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">{t("title")}</h1>

      <ul className="mt-6 divide-y divide-border rounded-2xl border border-border">
        {users.map((user) => (
          <li key={user.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-foreground">{user.fullName}</p>
              <p className="mt-0.5 text-xs text-muted-foreground" dir="ltr">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => toggleRole(user)}>
                {user.role}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn("rounded-full", user.active ? "text-brand" : "text-destructive")}
                onClick={() => toggleActive(user)}
              >
                {user.active ? t("active") : t("inactive")}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
