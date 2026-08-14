# رز ورزان — پلتفرم دیجیتال

بازطراحی کامل سایت شرکت تعاونی کشت و صنعت مزارع رز ورزان با Next.js (وب‌سایت و فروشگاه دوزبانه) و NestJS + PostgreSQL (API، پرداخت، پنل مدیریت).

## اجرای محلی

1. `apps/api/.env.example` را به `apps/api/.env` و `apps/web/.env.local.example` را به `apps/web/.env.local` کپی کنید.
2. `docker compose up -d postgres`
3. `npm install`
4. `npm run db:generate && npm run db:push && npm run db:seed`
5. `npm run dev`

وب‌سایت روی `http://localhost:3020/fa` و API روی `http://localhost:4010/v1` اجرا می‌شود. PostgreSQL توسعه محلی روی پورت `55433` قرار دارد.

پس از seed، یک حساب ادمین با ایمیل `ADMIN_EMAIL` و رمز `ADMIN_PASSWORD` (تعریف‌شده در `apps/api/.env`) ساخته می‌شود — با همان اطلاعات در `/fa/auth/sign-in` وارد شوید تا به `/fa/admin` دسترسی داشته باشید.

## ساختار

- `apps/web` — Next.js 16 (App Router)، next-intl (fa/en)، next-themes، Tailwind v4 + shadcn/ui.
- `apps/api` — NestJS 11 + Prisma + PostgreSQL؛ احراز هویت با کوکی JWT (access/refresh)، پرداخت با درگاه زرین‌پال.

## تمرکز نسخه اول

- کاتالوگ سه خط تولید مزرعه: گل‌های تزئینی، گیاهان دارویی و خوراکی، نهال درختان میوه.
- فروشگاه واقعی با سبد خرید، تکمیل سفارش و پرداخت آنلاین زرین‌پال (پیش‌فرض روی sandbox).
- حساب کاربری (تاریخچه سفارش‌ها) و پنل مدیریت (محصولات، دسته‌بندی‌ها، سفارش‌ها، کاربران، پیام‌های تماس).
- محتوای درباره‌ما/تماس‌با‌ما و اطلاعات ثبتی، مستقیماً از سایت رسمی شرکت.

> پیش از انتشار نهایی: تصاویر و مشخصات واقعی محصولات را در پنل مدیریت جایگزین نمونه‌های اولیه کنید، و `ZARINPAL_MERCHANT_ID` را با شناسه واقعی درگاه جایگزین نمایید.

## استقرار

هر سرویس یک `Dockerfile` مستقل دارد (`apps/api/Dockerfile`, `apps/web/Dockerfile`) و با متغیرهای محیطی مشابه `.env.example` قابل استقرار روی هر سرویس‌دهندهٔ Docker (مثلاً Railway) است.

مسیر بررسی وضعیت API: `GET /v1/health`
