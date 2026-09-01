import { NextResponse } from "next/server";
import { deleteNote } from "@/actions/note";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// DELETE /api/note/[id] 
export async function DELETE(request: Request, { params }: RouteParams) {
  const { searchParams } = new URL(request.url);
  const applicationId = searchParams.get("applicationId");

  if (!applicationId) {
    return NextResponse.json(
      {
        success: false,
        error: "O parâmetro applicationId é obrigatório na URL.",
      },
      { status: 400 },
    );
  }

  try {
    const { id } = await params;
    const result = await deleteNote(applicationId, id);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error },
      { status: 500 },
    );
  }
}
