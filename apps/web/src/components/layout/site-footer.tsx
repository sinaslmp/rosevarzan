import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tContact = useTranslations("contact");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-sage/40">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image src="/brand/logo-icon.png" alt="" width={36} height={36} className="size-9 object-contain" />
              <span className="font-heading text-lg font-semibold text-foreground">Rose Varzan</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{t("tagline")}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">{t("quickLinks")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/shop" className="hover:text-foreground">{tNav("shop")}</Link></li>
              <li><Link href="/about" className="hover:text-foreground">{tNav("about")}</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">{tNav("contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">{t("contactTitle")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li dir="ltr" className="text-end">{tContact("phoneValue")}</li>
              <li>{tContact("farmAddressValue")}</li>
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">{t("rights", { year })}</p>
      </div>
    </footer>
  );
}
