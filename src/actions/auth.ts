"use server"

import { auth } from "@/lib/auth";
import { SignInInput, signInSchema, SignUpInput, signUpSchema } from "@/schemas/auth";
import { isAPIError } from "better-auth/api";
import { headers } from "next/headers";
import z from "zod";

export async function signUpAction(input: SignUpInput) {
  const dataValidation = signUpSchema.safeParse(input);
  
  if (!dataValidation.success) {
    const prettyError = z.prettifyError(dataValidation.error);
    return { success: false, error: prettyError }
  }
  
  try {
    const data = await auth.api.signUpEmail({ 
      body: { 
        name: dataValidation.data.name,
        email: dataValidation.data.email,
        password: dataValidation.data.password
      },
      headers: await headers(),
    });

    return { success: true, data }
  } catch (error) {
    if (isAPIError(error)) {
      return { success: false, error: error.message }
    }
    
    console.error("Erro inesperado no signUpAction:", error)
    return { success: false, error: "Erro ao cadastrar usuário. Tente novamente." }
  }
}

export async function signInAction(input: SignInInput) {
  const dataValidation = signInSchema.safeParse(input);
  
  if (!dataValidation.success) {
    const prettyError = z.prettifyError(dataValidation.error);
    return { success: false, error: prettyError }
  }
  
  try {
    const data = await auth.api.signInEmail({ 
      body: { 
        email: dataValidation.data.email,
        password: dataValidation.data.password
      },
      headers: await headers(),
    });

    return { success: true, data }
  } catch (error) {
    if (isAPIError(error)) {
      return { success: false, error: error.message }
    }
    
    console.error("Erro inesperado no signInAction:", error)
    return { success: false, error: "Erro ao Fazer Login. Tente novamente." }
  }
}

export async function signOutAction() {
  try {
    const data = await auth.api.signOut({ headers: await headers(), });

    return { success: true, data }
  } catch (error) {
    if (isAPIError(error)) {
      return { success: false, error: error.message }
    }
    
    console.error("Erro inesperado no signOutAction:", error)
    return { success: false, error: "Erro ao Sair. Tente novamente." }
  }
}