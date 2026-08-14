import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";
import type { ListProductsDto } from "./dto/list-products.dto";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListProductsDto) {
    const where: Prisma.ProductWhereInput = { published: true };
    if (query.category) where.category = { slug: query.category };
    if (query.featured === "true") where.featured = true;
    if (query.search) {
      const search = query.search;
      where.OR = [
        { nameFa: { contains: search, mode: "insensitive" } },
        { nameEn: { contains: search, mode: "insensitive" } },
        { summaryFa: { contains: search, mode: "insensitive" } },
        { summaryEn: { contains: search, mode: "insensitive" } },
      ];
    }
    const products = await this.prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });
    return { data: { products } };
  }

  async detail(slug: string) {
    const product = await this.prisma.product.findFirst({ where: { slug, published: true }, include: { category: true } });
    if (!product) throw new NotFoundException("Product not found");
    return { data: { product } };
  }
}
