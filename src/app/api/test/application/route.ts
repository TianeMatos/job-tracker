import { NextResponse } from "next/server";
import {
  applyToJob,
  getApplications,
} from "@/actions/application";

export const dynamic = "force-dynamic";

// GET /api/applications 
export async function GET() {
  try {
    const result = await getApplications();

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

// POST /api/applications?jobId=SEU_JOB_ID
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "O parâmetro jobId é obrigatório na URL." },
        { status: 400 }
      );
    }

    // const body = await request.json();
    const result = await applyToJob(jobId);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}