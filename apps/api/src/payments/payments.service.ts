import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";
import { ZarinpalProvider } from "./zarinpal.provider";

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly zarinpal: ZarinpalProvider,
    private readonly config: ConfigService,
  ) {}

  async requestPayment(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException("Order not found");
    if (order.status !== OrderStatus.PENDING_PAYMENT) throw new BadRequestException("Order is not awaiting payment");

    const callbackUrl = `${this.apiPublicUrl}/v1/payments/verify`;
    const result = await this.zarinpal.requestPayment({
      amountRial: order.total,
      description: `سفارش ${order.orderNumber} — رز ورزان`,
      callbackUrl,
      mobile: order.contactPhone,
    });

    if (!result.ok) throw new BadRequestException(result.message);

    await this.prisma.payment.create({
      data: { orderId: order.id, provider: "zarinpal", authority: result.authority, amount: order.total, status: PaymentStatus.PENDING },
    });

    return { data: { gatewayUrl: result.gatewayUrl } };
  }

  async verifyCallback(authority: string | undefined, status: string | undefined) {
    if (!authority) return this.redirect(undefined, "failed");

    const payment = await this.prisma.payment.findUnique({ where: { authority }, include: { order: true } });
    if (!payment) return this.redirect(undefined, "failed");

    if (status !== "OK") {
      await this.prisma.payment.update({ where: { id: payment.id }, data: { status: PaymentStatus.FAILED } });
      return this.redirect(payment.orderId, "failed");
    }

    const result = await this.zarinpal.verifyPayment({ amountRial: payment.amount, authority });
    if (!result.ok) {
      await this.prisma.payment.update({ where: { id: payment.id }, data: { status: PaymentStatus.FAILED } });
      return this.redirect(payment.orderId, "failed");
    }

    await this.prisma.$transaction([
      this.prisma.payment.update({ where: { id: payment.id }, data: { status: PaymentStatus.SUCCESS, refId: result.refId } }),
      this.prisma.order.update({ where: { id: payment.orderId }, data: { status: OrderStatus.PAID } }),
    ]);
    return this.redirect(payment.orderId, "success");
  }

  private redirect(orderId: string | undefined, outcome: "success" | "failed") {
    const url = new URL("/checkout/result", this.webOrigin);
    url.searchParams.set("status", outcome);
    if (orderId) url.searchParams.set("orderId", orderId);
    return { redirectUrl: url.toString() };
  }

  private get apiPublicUrl() {
    return this.config.get<string>("API_PUBLIC_URL") ?? `http://localhost:${this.config.get<string>("PORT") ?? "4010"}`;
  }

  private get webOrigin() {
    return (this.config.get<string>("WEB_ORIGIN") ?? "http://localhost:3020").split(",")[0].trim();
  }
}
