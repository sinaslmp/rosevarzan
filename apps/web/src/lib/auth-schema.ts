import { z } from "zod";

export function createSignInSchema(messages: { emailInvalid: string; passwordRequired: string }) {
  return z.object({
    email: z.string().trim().email(messages.emailInvalid),
    password: z.string().min(1, messages.passwordRequired),
  });
}

export function createSignUpSchema(messages: { nameRequired: string; emailInvalid: string; passwordWeak: string }) {
  return z.object({
    fullName: z.string().trim().min(2, messages.nameRequired),
    email: z.string().trim().email(messages.emailInvalid),
    phone: z.string().trim().optional(),
    password: z
      .string()
      .min(10, messages.passwordWeak)
      .regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, messages.passwordWeak),
  });
}

export type SignInFormValues = z.infer<ReturnType<typeof createSignInSchema>>;
export type SignUpFormValues = z.infer<ReturnType<typeof createSignUpSchema>>;
