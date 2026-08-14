"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { admin } from "@/lib/api";
import type { Category } from "@/lib/types";

type FormState = Omit<Category, "id">;

const emptyForm: FormState = { slug: "", nameFa: "", nameEn: "", descriptionFa: "", descriptionEn: "", displayOrder: 0 };

export default function AdminCategoriesPage() {
  const t = useTranslations("admin.categories");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  function load() {
    admin.categories().then((res) => setCategories(res.categories));
  }

  useEffect(load, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setForm({ slug: category.slug, nameFa: category.nameFa, nameEn: category.nameEn, descriptionFa: category.descriptionFa, descriptionEn: category.descriptionEn, displayOrder: category.displayOrder });
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing) await admin.updateCategory(editing.id, form);
      else await admin.createCategory(form);
      setOpen(false);
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : tCommon("error"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await admin.deleteCategory(id);
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : tCommon("error"));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold text-foreground">{t("title")}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button type="button" size="sm" className="rounded-full" onClick={openCreate} />}>
            <Plus className="size-4" aria-hidden />
            {t("new")}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? t("edit") : t("new")}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-1.5">
                <Label>{t("fields.slug")}</Label>
                <Input dir="ltr" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label>{t("fields.nameFa")}</Label>
                  <Input value={form.nameFa} onChange={(e) => setForm({ ...form, nameFa: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label>{t("fields.nameEn")}</Label>
                  <Input dir="ltr" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label>{t("fields.descriptionFa")}</Label>
                <Textarea rows={2} value={form.descriptionFa} onChange={(e) => setForm({ ...form, descriptionFa: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label>{t("fields.descriptionEn")}</Label>
                <Textarea rows={2} dir="ltr" value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label>{t("fields.displayOrder")}</Label>
                <Input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleSave} disabled={saving} className="rounded-full">
                {t("save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <ul className="mt-6 divide-y divide-border rounded-2xl border border-border">
        {categories.map((category) => (
          <li key={category.id} className="flex items-center justify-between gap-3 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-foreground">{locale === "fa" ? category.nameFa : category.nameEn}</p>
              <p className="mt-0.5 text-xs text-muted-foreground" dir="ltr">{category.slug}</p>
            </div>
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => openEdit(category)} aria-label={t("edit")}>
                <Pencil className="size-4" aria-hidden />
              </Button>
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => handleDelete(category.id)} aria-label={t("delete")}>
                <Trash2 className="size-4 text-destructive" aria-hidden />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
