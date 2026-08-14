import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import type { Response } from "express";
import { RequestPaymentDto } from "./dto/request-payment.dto";
import { PaymentsService } from "./payments.service";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post("request")
  request(@Body() input: RequestPaymentDto) {
    return this.payments.requestPayment(input.orderId);
  }

  // Zarinpal redirects the customer's browser here after payment; we verify
  // server-side then bounce them on to the web app's result page.
  @Get("verify")
  async verify(@Query("Authority") authority: string | undefined, @Query("Status") status: string | undefined, @Res() response: Response) {
    const { redirectUrl } = await this.payments.verifyCallback(authority, status);
    response.redirect(302, redirectUrl);
  }
}
