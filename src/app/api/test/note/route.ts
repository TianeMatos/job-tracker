import { NextResponse } from "next/server";
import {
createNote,
getNotes
} from "@/actions/note";

export const dynamic = "force-dynamic";

// GET /api/note 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const applicationId = searchParams.get("applicationId");

  if (!applicationId) {
      return NextResponse.json(
        { success: false, error: "O parâmetro applicationId é obrigatório na URL." },
        { status: 400 }
      );
    }

  try {
    const result = await getNotes(applicationId);

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

// POST /api/note?applicationId=SEU_APPLICATION_ID
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("applicationId");

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: "O parâmetro applicationId é obrigatório na URL." },
        { status: 400 }
      );
    }
    const body = await request.json();
    const result = await createNote(applicationId, body);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error },
      { status: 400 }
    );
  }
}