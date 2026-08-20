import { getTranslations, setRequestLocale } from "next-intl/server";
import { FaqSection } from "@/components/sections/faq-section";

export default async function FaqPage({ params }: PageProps<"/[locale]/faq">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home.faq");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">{t("eyebrow")}</p>
      <h1 className="mt-2 font-heading text-3xl font-semibold text-foreground sm:text-4xl">{t("title")}</h1>

      <FaqSection locale={locale} />
    </div>
  );
}
