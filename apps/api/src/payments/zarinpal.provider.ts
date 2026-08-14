import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

type ZarinpalRequestResult =
  | { ok: true; authority: string; gatewayUrl: string }
  | { ok: false; message: string };

type ZarinpalVerifyResult =
  | { ok: true; refId: string }
  | { ok: false; message: string };

// Provider-shaped so a second gateway can be added later without touching
// OrdersService/PaymentsService. Defaults to Zarinpal's public sandbox
// endpoints (see apps/api/.env.example) so checkout works end-to-end without
// a real merchant account; swap the env vars for production.
@Injectable()
export class ZarinpalProvider {
  constructor(private readonly config: ConfigService) {}

  async requestPayment(input: { amountRial: number; description: string; callbackUrl: string; mobile?: string; email?: string }): Promise<ZarinpalRequestResult> {
    const response = await fetch(`${this.baseUrl}/request.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        merchant_id: this.merchantId,
        amount: input.amountRial,
        currency: "IRR",
        description: input.description,
        callback_url: input.callbackUrl,
        metadata: { mobile: input.mobile, email: input.email },
      }),
    });
    const payload = await response.json().catch(() => null);
    const authority = payload?.data?.authority as string | undefined;
    if (payload?.data?.code === 100 && authority) {
      return { ok: true, authority, gatewayUrl: `${this.gatewayUrl}/${authority}` };
    }
    return { ok: false, message: this.extractError(payload) };
  }

  async verifyPayment(input: { amountRial: number; authority: string }): Promise<ZarinpalVerifyResult> {
    const response = await fetch(`${this.baseUrl}/verify.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ merchant_id: this.merchantId, amount: input.amountRial, currency: "IRR", authority: input.authority }),
    });
    const payload = await response.json().catch(() => null);
    const code = payload?.data?.code;
    // 100 = verified now, 101 = already verified (treated as success, e.g. on a duplicate callback).
    if ((code === 100 || code === 101) && payload?.data?.ref_id) {
      return { ok: true, refId: String(payload.data.ref_id) };
    }
    return { ok: false, message: this.extractError(payload) };
  }

  private extractError(payload: unknown) {
    const errors = (payload as { errors?: { message?: string } | unknown[] })?.errors;
    if (errors && typeof errors === "object" && "message" in errors) return String((errors as { message?: string }).message);
    return "Payment gateway request failed";
  }

  private get merchantId() {
    return this.config.get<string>("ZARINPAL_MERCHANT_ID") ?? "00000000-0000-0000-0000-000000000000";
  }

  private get baseUrl() {
    return this.config.get<string>("ZARINPAL_BASE_URL") ?? "https://sandbox.zarinpal.com/pg/v4/payment";
  }

  private get gatewayUrl() {
    return this.config.get<string>("ZARINPAL_GATEWAY_URL") ?? "https://sandbox.zarinpal.com/pg/StartPay";
  }
}
