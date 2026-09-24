"use server";

import { runAction, validationError } from "@/lib/action-helpers";
import { auth } from "@/lib/auth/auth";
import {
  signInSchema,
  signUpSchema,
} from "@/schemas/auth";
import { headers } from "next/headers";

export async function signUp(input: unknown) {
  const dataValidation = signUpSchema.safeParse(input);
  if (!dataValidation.success) return validationError(dataValidation.error);

  return runAction(async () => {
    await auth.api.signUpEmail({
      body: {
        name: dataValidation.data.name,
        email: dataValidation.data.email,
        password: dataValidation.data.password,
      },
      headers: await headers(),
    });
  });
}

export async function signIn(input: unknown) {
  const dataValidation = signInSchema.safeParse(input);

  if (!dataValidation.success) return validationError(dataValidation.error);

  return runAction(async () => {
    const result = await auth.api.signInEmail({
      body: {
        email: dataValidation.data.email,
        password: dataValidation.data.password,
      },
      headers: await headers(),
    });

    return result.user.name;
  });
}

export async function signOut() {
  return runAction(async () => {
    await auth.api.signOut({ headers: await headers() });
  });
}
