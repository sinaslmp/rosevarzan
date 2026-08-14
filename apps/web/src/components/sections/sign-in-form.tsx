"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "@/i18n/navigation";
import { createSignInSchema, type SignInFormValues } from "@/lib/auth-schema";

export function SignInForm() {
  const t = useTranslations("auth.signIn");
  const tValidation = useTranslations("auth.validation");
  const router = useRouter();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schema = useMemo(
    () => createSignInSchema({ emailInvalid: tValidation("emailInvalid"), passwordRequired: tValidation("passwordRequired") }),
    [tValidation],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: SignInFormValues) {
    setSubmitting(true);
    setError(null);
    const result = await login(values.email, values.password);
    setSubmitting(false);
    if (result.ok) {
      router.push("/account");
    } else {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" type="email" dir="ltr" {...register("email")} aria-invalid={!!errors.email} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">{t("password")}</Label>
        <Input id="password" type="password" dir="ltr" {...register("password")} aria-invalid={!!errors.password} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" className="w-full rounded-full" disabled={submitting}>
        {submitting && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
        {t("submit")}
      </Button>
    </form>
  );
}
