import { getTranslations } from "next-intl/server";

export async function TrustSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home.trust" });

  const items =
    locale === "fa"
      ? [
          { label: t("regNumber"), value: "۳۲۵" },
          { label: t("nationalId"), value: "10260072929", dir: "ltr" as const },
          { label: t("regDate"), value: "۱۳۸۲/۰۳/۲۷" },
          { label: t("location"), value: "طرقرود، نطنز، اصفهان" },
        ]
      : [
          { label: t("regNumber"), value: "325" },
          { label: t("nationalId"), value: "10260072929" },
          { label: t("regDate"), value: "1382 (2003)" },
          { label: t("location"), value: "Tarq-e Rud, Natanz, Isfahan" },
        ];

  return (
    <section className="border-y border-border bg-sage/40">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">{t("eyebrow")}</p>
        <h2 className="mt-2 max-w-2xl font-heading text-2xl font-semibold text-foreground sm:text-3xl">{t("title")}</h2>
        <dl className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {items.map((item) => (
            <div key={item.label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.label}</dt>
              <dd className="mt-1.5 font-heading text-lg font-semibold text-foreground" dir={item.dir}>
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
