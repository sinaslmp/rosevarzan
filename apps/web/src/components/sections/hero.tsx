"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STAGE_IMAGES = ["/farm/orchard-blossom.jpg", "/farm/damask-rose-petals.jpg", "/farm/saffron.jpg"];

export function Hero() {
  const t = useTranslations("home.hero");
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const stages = t.raw("stages") as { number: string; label: string; title: string; body: string }[];
  const stageIndex = Math.min(stages.length - 1, Math.floor(progress * stages.length));
  const stage = stages[stageIndex];

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const element = sectionRef.current;
      if (!element) return;
      const range = Math.max(element.offsetHeight - window.innerHeight, 1);
      setProgress(reducedMotion.matches ? 0 : Math.min(1, Math.max(0, -element.getBoundingClientRect().top / range)));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "230vh" }} aria-label={t("title")}>
      <div className="sticky top-0 flex min-h-svh flex-col overflow-hidden">
        <div className="absolute inset-0">
          {STAGE_IMAGES.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover transition-opacity duration-700 ease-out"
              style={{ opacity: index === stageIndex ? 1 : 0 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent rtl:bg-gradient-to-l" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-10 px-6 pt-24 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-medium tracking-wide text-brand">{t("eyebrow")}</p>
            <h1 className="mt-3 font-heading text-4xl font-semibold leading-[1.1] text-paper sm:text-5xl lg:text-6xl">{t("title")}</h1>
            <p className="mt-5 text-balance text-base leading-7 text-paper/80 sm:text-lg">{t("subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-6")}>
                {t("ctaShop")}
              </Link>
              <Link href="/about" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full border-paper/30 bg-paper/10 px-6 text-paper backdrop-blur hover:bg-paper/15 hover:text-paper")}>
                {t("ctaAbout")}
              </Link>
            </div>
          </div>

          <aside className="w-full max-w-sm rounded-2xl border border-paper/20 bg-ink/50 p-6 shadow-2xl backdrop-blur-md" aria-live="polite">
            <div className="flex items-center justify-between text-xs font-medium text-paper/60">
              <span>{t("routeLabel")}</span>
              <span dir="ltr">
                {stage.number} / {stages.length.toLocaleString()}
              </span>
            </div>
            <div className="mt-5 min-h-40">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">{stage.label}</p>
              <h2 key={stage.title} className="mt-2 font-heading text-xl font-semibold text-paper">
                {stage.title}
              </h2>
              <p key={stage.body} className="mt-2 text-sm leading-6 text-paper/75">
                {stage.body}
              </p>
            </div>
            <ol className="mt-5 flex items-center gap-2">
              {stages.map((item, index) => (
                <li key={item.number} className="flex-1">
                  <div className={cn("h-1 rounded-full transition-colors", index <= stageIndex ? "bg-brand" : "bg-paper/20")} />
                </li>
              ))}
            </ol>
          </aside>
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 pb-8 text-xs font-medium text-paper/55 sm:px-8">
          <span>{t("scrollHint")}</span>
          <div className="h-px w-24 overflow-hidden bg-paper/20">
            <div className="h-full bg-brand transition-[width] duration-150" style={{ width: `${Math.max(6, progress * 100)}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
