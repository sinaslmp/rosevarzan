"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { admin } from "@/lib/api";
import type { Category, Product } from "@/lib/types";

type FormState = Omit<Product, "id" | "category" | "images"> & { images: string };

const emptyForm = (categoryId: string): FormState => ({
  categoryId,
  slug: "",
  nameFa: "",
  nameEn: "",
  summaryFa: "",
  summaryEn: "",
  descriptionFa: "",
  descriptionEn: "",
  unitFa: "",
  unitEn: "",
  price: 0,
  stock: 0,
  images: "",
  featured: false,
  published: true,
  displayOrder: 0,
});

export default function AdminProductsPage() {
  const t = useTranslations("admin.products");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(""));
  const [saving, setSaving] = useState(false);

  function load() {
    admin.products().then((res) => setProducts(res.products));
    admin.categories().then((res) => setCategories(res.categories));
  }

  useEffect(load, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm(categories[0]?.id ?? ""));
    setOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setForm({
      categoryId: product.categoryId,
      slug: product.slug,
      nameFa: product.nameFa,
      nameEn: product.nameEn,
      summaryFa: product.summaryFa,
      summaryEn: product.summaryEn,
      descriptionFa: product.descriptionFa,
      descriptionEn: product.descriptionEn,
      unitFa: product.unitFa,
      unitEn: product.unitEn,
      price: product.price,
      stock: product.stock,
      images: product.images.join(", "),
      featured: product.featured,
      published: product.published,
      displayOrder: product.displayOrder,
    });
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = { ...form, images: form.images.split(",").map((s) => s.trim()).filter(Boolean) };
    try {
      if (editing) await admin.updateProduct(editing.id, payload);
      else await admin.createProduct(payload);
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
      await admin.deleteProduct(id);
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
          <DialogTrigger render={<Button type="button" size="sm" className="rounded-full" onClick={openCreate} disabled={categories.length === 0} />}>
            <Plus className="size-4" aria-hidden />
            {t("new")}
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? t("edit") : t("new")}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label>{t("fields.slug")}</Label>
                  <Input dir="ltr" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label>{t("fields.category")}</Label>
                  <Select value={form.categoryId} onValueChange={(value) => value && setForm({ ...form, categoryId: value })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("fields.category")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {locale === "fa" ? category.nameFa : category.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label>{t("fields.summaryFa")}</Label>
                  <Input value={form.summaryFa} onChange={(e) => setForm({ ...form, summaryFa: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label>{t("fields.summaryEn")}</Label>
                  <Input dir="ltr" value={form.summaryEn} onChange={(e) => setForm({ ...form, summaryEn: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label>{t("fields.descriptionFa")}</Label>
                  <Textarea rows={3} value={form.descriptionFa} onChange={(e) => setForm({ ...form, descriptionFa: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label>{t("fields.descriptionEn")}</Label>
                  <Textarea rows={3} dir="ltr" value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label>{t("fields.unitFa")}</Label>
                  <Input value={form.unitFa} onChange={(e) => setForm({ ...form, unitFa: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label>{t("fields.unitEn")}</Label>
                  <Input dir="ltr" value={form.unitEn} onChange={(e) => setForm({ ...form, unitEn: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label>{t("fields.price")}</Label>
                  <Input type="number" dir="ltr" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                </div>
                <div className="grid gap-1.5">
                  <Label>{t("fields.stock")}</Label>
                  <Input type="number" dir="ltr" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label>{t("fields.images")}</Label>
                <Input dir="ltr" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="size-4 rounded border-border accent-brand" />
                  {t("fields.featured")}
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="size-4 rounded border-border accent-brand" />
                  {t("fields.published")}
                </label>
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
        {products.map((product) => (
          <li key={product.id} className="flex items-center justify-between gap-3 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-foreground">{locale === "fa" ? product.nameFa : product.nameEn}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{product.published ? t("published") : t("unpublished")} · {product.stock}</p>
            </div>
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => openEdit(product)} aria-label={t("edit")}>
                <Pencil className="size-4" aria-hidden />
              </Button>
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => handleDelete(product.id)} aria-label={t("delete")}>
                <Trash2 className="size-4 text-destructive" aria-hidden />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
