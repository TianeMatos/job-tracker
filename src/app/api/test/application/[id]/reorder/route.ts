import { reorderApplication } from "@/actions/reorderApplication";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

//* PATCH /api/applications/[id]/reorder
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Executa a Server Action de reordenação
    const result = await reorderApplication(id, body);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Erro inesperado no PATCH /api/applications/[id]/reorder:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno no servidor ao reordenar candidatura." },
      { status: 500 }
    );
  }
}