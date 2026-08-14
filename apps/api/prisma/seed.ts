import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PLACEHOLDER_NOTE_FA =
  "این محصول یک نمونهٔ اولیه است — لطفاً از پنل مدیریت، تصاویر و مشخصات واقعی این کالا را جایگزین کنید.";
const PLACEHOLDER_NOTE_EN =
  "This is a starter placeholder product — replace it with real photos and details from the admin panel.";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@rosevarzan.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      fullName: "مدیر رز ورزان",
      role: "ADMIN",
    },
  });

  const categories = [
    {
      slug: "ornamental-flowers",
      displayOrder: 1,
      nameFa: "گل‌های تزئینی",
      nameEn: "Ornamental Flowers",
      descriptionFa: "انواع گل و گیاه زینتی پرورش‌یافته در مزرعهٔ رز ورزان، مناسب فضای باز و آپارتمانی.",
      descriptionEn: "Ornamental flowers and plants grown on the Rose Varzan farm, for gardens and indoor spaces.",
      products: [
        {
          slug: "rose-seedling",
          nameFa: "نهال گل رز",
          nameEn: "Rose Plant",
          summaryFa: "نهال گل رز پرورش‌یافته در مزرعهٔ ورزان.",
          summaryEn: "Rose plant grown on the Varzan farm.",
          unitFa: "بوته",
          unitEn: "plant",
          price: 350000,
          stock: 40,
          images: ["/farm/rose-garden.jpg"],
        },
        {
          slug: "chrysanthemum",
          nameFa: "گل داوودی",
          nameEn: "Chrysanthemum",
          summaryFa: "گل داوودی گلدانی، مناسب فضای باز و بالکن.",
          summaryEn: "Potted chrysanthemum, suitable for balconies and gardens.",
          unitFa: "گلدان",
          unitEn: "pot",
          price: 180000,
          stock: 60,
        },
      ],
    },
    {
      slug: "medicinal-edible-plants",
      displayOrder: 0,
      nameFa: "گیاهان دارویی و خوراکی",
      nameEn: "Medicinal & Edible Plants",
      descriptionFa: "گیاهان دارویی سنتی، برداشت‌دستی و خشک‌شده زیر سایه — بدون افزودنی، به شیوهٔ کشاورزان روستای ورزان.",
      descriptionEn: "Traditional medicinal herbs, hand-harvested and shade-dried — no additives, grown the way Varzan's farmers always have.",
      products: [
        {
          slug: "damask-rose-buds",
          nameFa: "غنچهٔ گل محمدی خشک",
          nameEn: "Dried Damask Rose Buds",
          summaryFa: "غنچهٔ خشک‌شدهٔ گل محمدی، برداشت مزرعهٔ ورزان.",
          summaryEn: "Sun-dried Damask rose buds, harvested on the Varzan farm.",
          unitFa: "بستهٔ ۱۰۰ گرمی",
          unitEn: "100g pack",
          price: 220000,
          stock: 100,
          images: ["/farm/damask-rose-petals.jpg"],
        },
        {
          slug: "mint-seedling",
          nameFa: "نهال نعناع",
          nameEn: "Mint Plant",
          summaryFa: "نهال نعناع خوراکی مناسب کشت خانگی.",
          summaryEn: "Edible mint plant, suitable for home growing.",
          unitFa: "بوته",
          unitEn: "plant",
          price: 90000,
          stock: 150,
        },
      ],
    },
    {
      slug: "fruit-tree-saplings",
      displayOrder: 2,
      nameFa: "نهال درختان میوه",
      nameEn: "Fruit Tree Saplings",
      descriptionFa: "نهال درختان میوهٔ هسته‌دار و بدون‌هسته، پرورش‌یافته در مزرعهٔ رز ورزان.",
      descriptionEn: "Stone and seedless fruit tree saplings, grown on the Rose Varzan farm.",
      products: [
        {
          slug: "pitted-cherry-sapling",
          nameFa: "نهال گیلاس هسته‌دار",
          nameEn: "Pitted Cherry Sapling",
          summaryFa: "نهال گیلاس هسته‌دار، آماده برای انتقال به باغ.",
          summaryEn: "Pitted cherry sapling, ready for garden planting.",
          unitFa: "اصله",
          unitEn: "sapling",
          price: 480000,
          stock: 30,
          images: ["/farm/cherries.jpg"],
        },
        {
          slug: "seedless-grape-sapling",
          nameFa: "نهال انگور بی‌دانه",
          nameEn: "Seedless Grape Sapling",
          summaryFa: "نهال انگور بی‌دانه، مناسب اقلیم نطنز و اصفهان.",
          summaryEn: "Seedless grape sapling, suited to the Natanz/Isfahan climate.",
          unitFa: "اصله",
          unitEn: "sapling",
          price: 300000,
          stock: 45,
        },
      ],
    },
  ];

  for (const { products, ...categoryData } of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: categoryData,
      create: categoryData,
    });

    for (const [index, product] of products.entries()) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: {
          ...product,
          categoryId: category.id,
          descriptionFa: `${product.summaryFa} ${PLACEHOLDER_NOTE_FA}`,
          descriptionEn: `${product.summaryEn} ${PLACEHOLDER_NOTE_EN}`,
          images: "images" in product ? product.images : [],
          featured: index === 0,
          published: true,
          displayOrder: index,
        },
      });
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
