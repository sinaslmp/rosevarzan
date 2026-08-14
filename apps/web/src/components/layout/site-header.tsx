"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LayoutDashboard, LogOut, Menu, UserRound, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { CartSheet } from "@/components/layout/cart-sheet";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { key: "shop", href: "/shop" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function isNavActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    router.push("/");
  }

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl border border-border bg-background/85 px-3 py-2.5 shadow-sm backdrop-blur-xl sm:px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/brand/logo-icon.png" alt="" width={32} height={32} className="size-8 object-contain" priority />
          <span className="font-heading text-lg font-semibold tracking-tight text-foreground">Rose Varzan</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isNavActive(link.href);
            return (
              <Link
                key={link.key}
                href={link.href}
                className={cn("text-sm font-medium transition-colors", active ? "text-foreground" : "text-foreground/55 hover:text-foreground/80")}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-2.5 md:flex">
          <ThemeSwitcher />
          <CartSheet />
          <LanguageSwitcher />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full bg-muted py-1 pe-3 ps-1 text-sm text-foreground transition-colors hover:bg-muted/70"
                  />
                }
              >
                <Avatar size="sm">
                  <AvatarFallback className="bg-brand-soft text-brand">{initials(user.fullName)}</AvatarFallback>
                </Avatar>
                <span className="max-w-28 truncate font-medium">{user.fullName}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={10}>
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="truncate" dir="ltr">
                    {user.email}
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/account" />}>
                  <UserRound className="size-4" aria-hidden />
                  {t("account")}
                </DropdownMenuItem>
                {user.role === "ADMIN" && (
                  <DropdownMenuItem render={<Link href="/admin" />}>
                    <LayoutDashboard className="size-4" aria-hidden />
                    {t("admin")}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  <LogOut className="size-4" aria-hidden />
                  {t("signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/sign-in" className={cn(buttonVariants({ size: "sm" }), "rounded-full")}>
              {t("signIn")}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeSwitcher />
          <CartSheet />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={t(menuOpen ? "closeMenu" : "openMenu")}
            className="flex items-center justify-center rounded-full p-2 text-foreground"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-2 max-w-6xl rounded-2xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = isNavActive(link.href);
                return (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn("flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium", active ? "bg-muted text-foreground" : "text-foreground/70")}
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2.5 rounded-lg bg-muted px-3 py-2">
                    <Avatar size="sm">
                      <AvatarFallback className="bg-brand-soft text-brand">{initials(user.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{user.fullName}</p>
                      <p className="truncate text-xs text-muted-foreground" dir="ltr">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Link href="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/70">
                    <UserRound className="size-4" aria-hidden />
                    {t("account")}
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/70">
                      <LayoutDashboard className="size-4" aria-hidden />
                      {t("admin")}
                    </Link>
                  )}
                  <button type="button" onClick={handleLogout} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-start text-sm font-medium text-destructive">
                    <LogOut className="size-4" aria-hidden />
                    {t("signOut")}
                  </button>
                </>
              ) : (
                <Link href="/auth/sign-in" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5 text-sm font-medium text-foreground">
                  <UserRound className="size-4" aria-hidden />
                  {t("signIn")}
                </Link>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
              <LanguageSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
