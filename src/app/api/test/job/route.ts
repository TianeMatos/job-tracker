import { createJob, getJobs } from "@/actions/job";
import { NextRequest, NextResponse } from "next/server";

//* POST Create a Job / Job + Application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const result = await createJob(body);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro interno no servidor. " + error },
      { status: 500 }
    )
  }
}

//* GET all Jobs (com suporte a paginação)
export async function GET(request: NextRequest) {
  try {
    // Extrai os query params 'page' e 'limit' da URL (ex: /api/jobs?page=1&limit=10)
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    const result = await getJobs({
      ...(page && { page: Number(page) }),
      ...(limit && { limit: Number(limit) }),
    });

    if (!result.success) {
      return NextResponse.json(result);
    }

    // Retorna 200 OK para leitura de dados
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Erro inesperado no GET /api/jobs:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno no servidor ao buscar vagas." },
      { status: 500 }
    );
  }
}