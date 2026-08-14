import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const registrationItems = [t("registration.name"), t("registration.number"), t("registration.nationalId"), t("registration.type"), t("registration.date")];

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8">
      <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">{t("title")}</h1>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl">
        <Image src="/farm/estate-pool.jpg" alt="" fill sizes="(min-width: 1024px) 800px, 100vw" className="object-cover" />
      </div>

      <div className="mt-10 space-y-5 text-base leading-8 text-foreground/85">
        <p>{t("intro")}</p>
        <p>{t("location")}</p>
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-sage/30 p-6 sm:p-8">
        <h2 className="text-sm font-semibold text-foreground">{t("registrationTitle")}</h2>
        <ul className="mt-4 space-y-2.5 text-sm text-foreground/80">
          {registrationItems.map((item) => (
            <li key={item} className="flex items-baseline gap-2">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {["/farm/orchard-blossom.jpg", "/farm/rose-garden.jpg", "/farm/saffron.jpg", "/farm/cherries.jpg", "/farm/apples.jpg", "/farm/estate-courtyard.jpg"].map((src) => (
          <div key={src} className="relative aspect-square overflow-hidden rounded-2xl">
            <Image src={src} alt="" fill sizes="200px" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
