import { Injectable, NotFoundException } from "@nestjs/common";
import { OrderStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";
import type { UpdateContactMessageDto, UpdateOrderStatusDto, UpdateUserDto, UpsertCategoryDto, UpsertProductDto } from "./dto/admin.dto";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async overview() {
    const [userCount, orderCount, pendingOrders, paidAggregate, unhandledMessages, lowStockProducts] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING_PAYMENT } }),
      this.prisma.order.aggregate({ where: { status: { in: [OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED] } }, _sum: { total: true } }),
      this.prisma.contactMessage.count({ where: { handled: false } }),
      this.prisma.product.count({ where: { stock: { lte: 5 }, published: true } }),
    ]);
    return {
      data: {
        userCount,
        orderCount,
        pendingOrders,
        revenue: paidAggregate._sum.total ?? 0,
        unhandledMessages,
        lowStockProducts,
      },
    };
  }

  // --- Categories ---
  categories() {
    return this.prisma.category.findMany({ orderBy: { displayOrder: "asc" } }).then((categories) => ({ data: { categories } }));
  }

  async createCategory(input: UpsertCategoryDto) {
    const category = await this.prisma.category.create({ data: input });
    return { data: { category } };
  }

  async updateCategory(id: string, input: Partial<UpsertCategoryDto>) {
    const category = await this.prisma.category.update({ where: { id }, data: input });
    return { data: { category } };
  }

  async deleteCategory(id: string) {
    await this.prisma.category.delete({ where: { id } });
    return { data: { success: true } };
  }

  // --- Products ---
  products() {
    return this.prisma.product
      .findMany({ include: { category: true }, orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }] })
      .then((products) => ({ data: { products } }));
  }

  async createProduct(input: UpsertProductDto) {
    const product = await this.prisma.product.create({ data: input });
    return { data: { product } };
  }

  async updateProduct(id: string, input: Partial<UpsertProductDto>) {
    const product = await this.prisma.product.update({ where: { id }, data: input });
    return { data: { product } };
  }

  async deleteProduct(id: string) {
    await this.prisma.product.delete({ where: { id } });
    return { data: { success: true } };
  }

  // --- Orders ---
  orders(status?: OrderStatus) {
    const where: Prisma.OrderWhereInput = status ? { status } : {};
    return this.prisma.order
      .findMany({ where, include: { items: true, payments: true, user: true }, orderBy: { createdAt: "desc" } })
      .then((orders) => ({ data: { orders } }));
  }

  async order(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id }, include: { items: true, payments: true, user: true } });
    if (!order) throw new NotFoundException("Order not found");
    return { data: { order } };
  }

  async updateOrderStatus(id: string, input: UpdateOrderStatusDto, actorId: string) {
    const order = await this.prisma.order.update({ where: { id }, data: { status: input.status } });
    await this.prisma.auditLog.create({ data: { actorId, action: "order.status_changed", entity: "Order", entityId: id, metadata: { status: input.status } } });
    return { data: { order } };
  }

  // --- Users ---
  users() {
    return this.prisma.user.findMany({ orderBy: { createdAt: "desc" } }).then((users) => ({ data: { users } }));
  }

  async updateUser(id: string, input: UpdateUserDto, actorId: string) {
    const user = await this.prisma.user.update({ where: { id }, data: input });
    await this.prisma.auditLog.create({ data: { actorId, action: "user.updated", entity: "User", entityId: id, metadata: { ...input } } });
    return { data: { user } };
  }

  // --- Contact messages ---
  contactMessages() {
    return this.prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }).then((messages) => ({ data: { messages } }));
  }

  async updateContactMessage(id: string, input: UpdateContactMessageDto) {
    const message = await this.prisma.contactMessage.update({ where: { id }, data: input });
    return { data: { message } };
  }
}
