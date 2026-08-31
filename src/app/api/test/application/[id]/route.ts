import { NextResponse } from "next/server";
import {
  deleteApplication,
  updateApplicationDetails,
  updateApplicationStatus,
} from "@/actions/application"; // Ajuste o caminho de importação conforme sua pasta

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/applications/[id] -> Atualiza os dados ou o status da candidatura
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Se o body contiver apenas o campo de status (ou um campo individual), atualiza o status; 
    // caso contrário, atualiza os detalhes completos.
    let result;
    if (body.status && Object.keys(body).length === 1) {
      result = await updateApplicationStatus(id, body.status);
    } else {
      result = await updateApplicationDetails(id, body);
    }

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}

// DELETE /api/applications/[id] -> Remove a candidatura
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = await deleteApplication(id);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}