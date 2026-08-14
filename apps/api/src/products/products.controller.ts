import { Controller, Get, Param, Query } from "@nestjs/common";
import { ListProductsDto } from "./dto/list-products.dto";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  list(@Query() query: ListProductsDto) {
    return this.products.list(query);
  }

  @Get(":slug")
  detail(@Param("slug") slug: string) {
    return this.products.detail(slug);
  }
}
