"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, contact } from "@/lib/api";

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>();

  async function onSubmit(values: ContactFormValues) {
    setSubmitting(true);
    setStatus("idle");
    try {
      await contact.send(values);
      setStatus("success");
      reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof ApiError ? error.message : null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">{t("name")}</Label>
          <Input id="name" {...register("name", { required: true })} aria-invalid={!!errors.name} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input id="phone" dir="ltr" {...register("phone")} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" type="email" dir="ltr" {...register("email")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="subject">{t("subject")}</Label>
        <Input id="subject" {...register("subject")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">{t("message")}</Label>
        <Textarea id="message" rows={5} {...register("message", { required: true })} aria-invalid={!!errors.message} />
      </div>

      {status === "success" && <p className="text-sm text-brand">{t("success")}</p>}
      {status === "error" && <p className="text-sm text-destructive">{errorMessage ?? t("error")}</p>}

      <Button type="submit" size="lg" className="rounded-full" disabled={submitting}>
        {submitting && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
        {submitting ? t("sending") : t("submit")}
      </Button>
    </form>
  );
}
