import { NextResponse } from "next/server";
import { getDashboardMetrics } from "@/actions/dashboardMetrics"; 

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getDashboardMetrics();

    if (!result.success) {
      const status = result.error === "Não autenticado." ? 401 : 400;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Erro no Route Handler de métricas:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}