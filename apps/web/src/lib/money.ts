// Prices are stored in Rial (Prisma `Product.price`, an Int). Iranian
// storefronts conventionally display prices in Toman (1 Toman = 10 Rial).
export function toToman(priceRial: number): number {
  return Math.round(priceRial / 10);
}
