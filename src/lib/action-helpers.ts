import { Prisma } from "@/generated/prisma/client";
import { AuthError, BusinessError } from "./errors";
import z from "zod";
import { isAPIError } from "better-auth/api";

export type PaginatedResult<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
};

export type ActionError = { message: string; code?: number };

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: ActionError };

export async function runAction<T>(
  fn: () => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    if (isAPIError(error)) {
      return { success: false, error: { message: error.message, code: error.statusCode } }
    }
    
    if (error instanceof AuthError) {
      return { success: false, error: { message: error.message, code: 401 } };
    }
    
    if (error instanceof BusinessError) {
      return { success: false, error: { message: error.message } };
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return {
          success: false,
          error: { message: "Registro não encontrado.", code: 404 },
        };
      }
      if (error.code === "P2002") {
        return {
          success: false,
          error: { message: "Registro duplicado.", code: 409 },
        };
      }
    }

    console.error(error);
    return {
      success: false,
      error: { message: "Ocorreu um erro inesperado. Tente novamente." },
    };
  }
}

export function validationError(error: z.ZodError): ActionResult<never> {
  return {
    success: false,
    error: { message: z.prettifyError(error), code: 400 },
  };
}
