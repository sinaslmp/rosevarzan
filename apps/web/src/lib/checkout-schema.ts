import { z } from "zod";

export function createCheckoutSchema(messages: { nameRequired: string; phoneRequired: string; cityRequired: string; addressRequired: string }) {
  return z.object({
    contactName: z.string().trim().min(2, messages.nameRequired),
    contactPhone: z.string().trim().min(6, messages.phoneRequired),
    province: z.string().trim().min(2, messages.cityRequired),
    city: z.string().trim().min(2, messages.cityRequired),
    addressLine: z.string().trim().min(5, messages.addressRequired),
    postalCode: z.string().trim().optional(),
    note: z.string().trim().optional(),
  });
}

export type CheckoutFormValues = z.infer<ReturnType<typeof createCheckoutSchema>>;
