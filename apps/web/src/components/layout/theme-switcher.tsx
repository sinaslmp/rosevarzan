"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

const themeOptions = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
] as const;

export function ThemeSwitcher({ className }: { className?: string }) {
  const t = useTranslations("nav.themeSwitcher");
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const selectedTheme = mounted ? (theme ?? "system") : "system";
  const SelectedIcon = themeOptions.find((option) => option.value === selectedTheme)?.icon ?? Monitor;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={t("label")}
            title={t("label")}
            className={cn(
              "flex size-9 items-center justify-center rounded-full border border-border bg-transparent text-foreground/70 transition-colors hover:bg-muted hover:text-foreground",
              className,
            )}
          />
        }
      >
        <SelectedIcon className="size-4" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="min-w-36">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("label")}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuRadioGroup value={selectedTheme} onValueChange={setTheme}>
          {themeOptions.map(({ value, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <Icon className="size-4 text-muted-foreground" aria-hidden />
              {t(value)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
