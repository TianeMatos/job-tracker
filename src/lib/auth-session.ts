import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getCurrentSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireAuth() {
  const session = await getCurrentSession();

  if (!session) {
    console.log("Erro ao Autenticar usuário");
    throw new Error("Não autenticado.").message;
  }

  return session;
}