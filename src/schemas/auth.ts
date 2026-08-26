import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(2, { error: "O nome deve ter pelo menos 2 caracteres." }),
  email: z.email({ error: "Insira um e-mail válido." }),
  password: z.string().min(6, { error: "A senha deve ter pelo menos 6 caracteres." }),
});

export const signInSchema = z.object({
  email: z.email({ error: "Insira um e-mail válido." }),
  password: z.string().min(1, { error: "A senha é obrigatória." }),
});

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>