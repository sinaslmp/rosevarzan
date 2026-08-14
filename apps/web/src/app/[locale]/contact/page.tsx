import { MapPin, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/sections/contact-form";

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
      <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">{t("title")}</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{t("infoTitle")}</h2>

          <dl className="mt-5 space-y-6">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("farmAddress")}</dt>
                <dd className="mt-1 text-sm text-foreground/85">{t("farmAddressValue")}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("officeAddress")}</dt>
                <dd className="mt-1 text-sm leading-6 text-foreground/85">{t("officeAddressValue")}</dd>
                <dd className="mt-1 text-xs text-muted-foreground">
                  {t("postalCode")}: {t("postalCodeValue")}
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("phone")}</dt>
                <dd className="mt-1 text-sm text-foreground/85" dir="ltr">
                  {t("phoneValue")}
                </dd>
              </div>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-border p-6 sm:p-8">
          <h2 className="text-sm font-semibold text-foreground">{t("form.title")}</h2>
          <div className="mt-5">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
