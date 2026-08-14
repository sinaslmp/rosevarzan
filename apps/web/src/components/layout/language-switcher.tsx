"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeFlags, localeLabels, routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("nav.languageSwitcher");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function switchTo(next: string) {
    if (next === locale) return;
    router.replace(
      // @ts-expect-error -- pathname is dynamic across all routes
      { pathname, params },
      { locale: next as AppLocale },
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={t("label")}
            title={t("label")}
            className={cn(
              "flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground",
              className,
            )}
          />
        }
      >
        <Globe className="size-3.5" aria-hidden />
        <span aria-hidden>{localeFlags[locale]}</span>
        <span className="uppercase" dir="ltr">
          {locale}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="max-h-80 min-w-44 overflow-y-auto">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("label")}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuRadioGroup value={locale} onValueChange={switchTo}>
          {routing.locales.map((loc) => (
            <DropdownMenuRadioItem key={loc} value={loc}>
              <span aria-hidden>{localeFlags[loc]}</span>
              {localeLabels[loc]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
