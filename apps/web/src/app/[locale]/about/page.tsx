import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tHero = await getTranslations("home.hero");

  const registrationItems = [t("registration.name"), t("registration.number"), t("registration.nationalId"), t("registration.type"), t("registration.date")];
  const stages = tHero.raw("stages") as { number: string; label: string; title: string; body: string }[];

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8">
      <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">{t("title")}</h1>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl">
        <Image src="/farm/apple-orchard.jpg" alt="" fill sizes="(min-width: 1024px) 800px, 100vw" className="object-cover" />
      </div>

      <div className="mt-10 space-y-5 text-base leading-8 text-foreground/85">
        <p>{t("intro")}</p>
        <p>{t("location")}</p>
      </div>

      <div className="mt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">{t("process.eyebrow")}</p>
        <h2 className="mt-2 font-heading text-2xl font-semibold text-foreground">{t("process.title")}</h2>
        <ol className="mt-8 grid gap-8 sm:grid-cols-3">
          {stages.map((stage) => (
            <li key={stage.number} className="border-t-2 border-brand pt-4">
              <span className="font-mono text-xs text-muted-foreground" dir="ltr">
                {stage.number}
              </span>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-brand">{stage.label}</p>
              <h3 className="mt-1 font-heading text-lg font-semibold text-foreground">{stage.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{stage.body}</p>
            </li>
          ))}
        </ol>
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
        {["/farm/cherry-blossom.jpg", "/farm/rose-bed.jpg", "/farm/saffron-crocus.jpg", "/farm/dried-herbs-jars.jpg", "/farm/cherry-branch.jpg", "/farm/floral-arrangement.jpg"].map((src) => (
          <div key={src} className="relative aspect-square overflow-hidden rounded-2xl">
            <Image src={src} alt="" fill sizes="200px" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
