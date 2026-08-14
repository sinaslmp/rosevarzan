import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Sprout } from "lucide-react";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { ApiError, catalog } from "@/lib/api";
import { toToman } from "@/lib/money";
import { Link } from "@/i18n/navigation";
import { AddToCartForm } from "@/components/sections/add-to-cart-form";

export default async function ProductPage({ params }: PageProps<"/[locale]/shop/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("product");
  const tShop = await getTranslations("shop");
  const tCommon = await getTranslations("common");
  const format = await getFormatter();

  const product = await catalog.product(slug).then(
    (res) => res.product,
    (error) => {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    },
  );

  if (!product) notFound();

  const name = locale === "fa" ? product.nameFa : product.nameEn;
  const description = locale === "fa" ? product.descriptionFa : product.descriptionEn;
  const unit = locale === "fa" ? product.unitFa : product.unitEn;
  const categoryName = product.category ? (locale === "fa" ? product.category.nameFa : product.category.nameEn) : null;
  const image = product.images[0];

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8">
      <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden />
        {t("backToShop")}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-sage/50">
          {image ? (
            <Image src={image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-brand/40">
              <Sprout className="size-16" aria-hidden />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          {categoryName && <p className="text-sm font-medium text-brand">{categoryName}</p>}
          <h1 className="mt-1 font-heading text-3xl font-semibold text-foreground sm:text-4xl">{name}</h1>

          <p className="mt-4 font-heading text-2xl font-semibold text-foreground">
            {format.number(toToman(product.price))} {tCommon("toman")}
            <span className="ms-1.5 text-sm font-sans font-normal text-muted-foreground">{tShop("perUnit", { unit })}</span>
          </p>

          <p className="mt-1 text-sm text-muted-foreground">{product.stock > 0 ? tShop("inStock") : tShop("outOfStock")}</p>

          <div className="mt-6">
            <AddToCartForm product={product} />
          </div>

          <div className="mt-10 border-t border-border pt-8">
            <h2 className="text-sm font-semibold text-foreground">{t("description")}</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
