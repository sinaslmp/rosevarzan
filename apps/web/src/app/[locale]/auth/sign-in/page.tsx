import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SignInForm } from "@/components/sections/sign-in-form";

export default async function SignInPage({ params }: PageProps<"/[locale]/auth/sign-in">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth.signIn");

  return (
    <div className="mx-auto flex max-w-sm flex-col px-6 py-20 sm:px-8">
      <h1 className="font-heading text-2xl font-semibold text-foreground">{t("title")}</h1>
      <div className="mt-8">
        <SignInForm />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/auth/sign-up" className="font-medium text-brand hover:underline">
          {t("signUpLink")}
        </Link>
      </p>
    </div>
  );
}
