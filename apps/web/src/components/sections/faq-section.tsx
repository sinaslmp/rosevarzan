import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function FaqSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home.faq" });
  const items = t.raw("items") as { question: string; answer: string }[];

  return (
    <dl className="mt-8 divide-y divide-border border-t border-border">
      {items.map((item) => (
        <details key={item.question} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-foreground marker:content-none">
            <dt>{item.question}</dt>
            <Plus className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45" aria-hidden />
          </summary>
          <dd className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</dd>
        </details>
      ))}
    </dl>
  );
}
