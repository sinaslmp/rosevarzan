"use client";

import { useEffect, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { admin } from "@/lib/api";
import type { ContactMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AdminMessagesPage() {
  const t = useTranslations("admin.messages");
  const tCommon = useTranslations("common");
  const format = useFormatter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  function load() {
    admin.contactMessages().then((res) => setMessages(res.messages));
  }

  useEffect(load, []);

  async function markHandled(message: ContactMessage) {
    try {
      await admin.updateContactMessage(message.id, !message.handled);
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : tCommon("error"));
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">{t("title")}</h1>

      <ul className="mt-6 space-y-3">
        {messages.map((message) => (
          <li key={message.id} className={cn("rounded-2xl border border-border p-5", message.handled && "opacity-60")}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">{message.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground" dir="ltr">
                  {[message.email, message.phone].filter(Boolean).join(" · ")}
                </p>
                {message.subject && <p className="mt-1 text-xs font-medium text-brand">{message.subject}</p>}
              </div>
              <span className="text-xs text-muted-foreground">{format.dateTime(new Date(message.createdAt), { dateStyle: "medium" })}</span>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm text-foreground">{message.message}</p>
            <Button type="button" variant="outline" size="sm" className="mt-3 rounded-full" onClick={() => markHandled(message)}>
              {message.handled ? t("handled") : t("markHandled")}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
