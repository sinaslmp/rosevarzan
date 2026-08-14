import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { ZarinpalProvider } from "./zarinpal.provider";

@Module({ controllers: [PaymentsController], providers: [PaymentsService, ZarinpalProvider], exports: [PaymentsService] })
export class PaymentsModule {}
