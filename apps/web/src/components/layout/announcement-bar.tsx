import { Truck } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function AnnouncementBar({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <div className="bg-brand py-1.5 text-center text-xs font-medium text-primary-foreground">
      <p className="mx-auto flex max-w-6xl items-center justify-center gap-1.5 px-6 sm:px-8">
        <Truck className="size-3.5" aria-hidden />
        {t("announcement")}
      </p>
    </div>
  );
}
