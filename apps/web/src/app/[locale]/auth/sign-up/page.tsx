import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SignUpForm } from "@/components/sections/sign-up-form";

export default async function SignUpPage({ params }: PageProps<"/[locale]/auth/sign-up">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth.signUp");

  return (
    <div className="mx-auto flex max-w-sm flex-col px-6 py-20 sm:px-8">
      <h1 className="font-heading text-2xl font-semibold text-foreground">{t("title")}</h1>
      <div className="mt-8">
        <SignUpForm />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("haveAccount")}{" "}
        <Link href="/auth/sign-in" className="font-medium text-brand hover:underline">
          {t("signInLink")}
        </Link>
      </p>
    </div>
  );
}
