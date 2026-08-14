import { CheckCircle2, XCircle } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { orders } from "@/lib/api";
import { cn } from "@/lib/utils";

export default async function CheckoutResultPage({
  params,
  searchParams,
}: PageProps<"/[locale]/checkout/result">) {
  const { locale } = await params;
  const { status, orderId } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("checkoutResult");

  const success = status === "success";
  const order = typeof orderId === "string" ? await orders.get(orderId).then((r) => r.order, () => null) : null;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center sm:px-8">
      {success ? <CheckCircle2 className="size-12 text-brand" aria-hidden /> : <XCircle className="size-12 text-destructive" aria-hidden />}

      <h1 className="mt-5 font-heading text-2xl font-semibold text-foreground">{success ? t("successTitle") : t("failedTitle")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{success ? t("successBody") : t("failedBody")}</p>

      {order && (
        <p className="mt-4 rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-foreground" dir="ltr">
          {t("orderNumber")}: {order.orderNumber}
        </p>
      )}

      <div className="mt-8 flex gap-3">
        <Link href="/shop" className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}>
          {t("backToShop")}
        </Link>
        {success && (
          <Link href="/account" className={cn(buttonVariants(), "rounded-full")}>
            {t("viewAccount")}
          </Link>
        )}
      </div>
    </div>
  );
}
