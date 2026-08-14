import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { generateOrderNumber } from "../common/order-number";
import { PrismaService } from "../common/prisma.service";
import type { AuthenticatedUser } from "../auth/auth.types";
import type { CreateOrderDto } from "./dto/create-order.dto";

// Flat-rate placeholder until the cooperative provides real courier pricing;
// safe to change here or make configurable once shipping zones are defined.
const SHIPPING_COST = 0;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateOrderDto, user: AuthenticatedUser | undefined) {
    const productIds = [...new Set(input.items.map((item) => item.productId))];
    const products = await this.prisma.product.findMany({ where: { id: { in: productIds }, published: true } });
    const productById = new Map(products.map((product) => [product.id, product]));

    let subtotal = 0;
    const itemsData = input.items.map((item) => {
      const product = productById.get(item.productId);
      if (!product) throw new BadRequestException(`Product ${item.productId} is not available`);
      if (product.stock < item.quantity) throw new BadRequestException(`Not enough stock for ${product.nameEn}`);
      subtotal += product.price * item.quantity;
      return {
        productId: product.id,
        nameFa: product.nameFa,
        nameEn: product.nameEn,
        unitPrice: product.price,
        quantity: item.quantity,
      };
    });

    const total = subtotal + SHIPPING_COST;

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: user?.id,
          contactName: input.contactName,
          contactPhone: input.contactPhone,
          province: input.province,
          city: input.city,
          addressLine: input.addressLine,
          postalCode: input.postalCode,
          note: input.note,
          subtotal,
          shippingCost: SHIPPING_COST,
          total,
          items: { create: itemsData },
        },
        include: { items: true },
      });
      for (const item of itemsData) {
        await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
      }
      return created;
    });

    return { data: { order } };
  }

  async findOne(id: string, user: AuthenticatedUser | undefined) {
    const order = await this.prisma.order.findUnique({ where: { id }, include: { items: true, payments: true } });
    if (!order) throw new NotFoundException("Order not found");
    if (order.userId && (!user || (user.id !== order.userId && user.role !== UserRole.ADMIN))) {
      throw new ForbiddenException("Insufficient permissions");
    }
    return { data: { order } };
  }
}
