import { createJobAction, getJobsAction } from "@/actions/job";
import { NextResponse } from "next/server";

//* POST Create a Job / Job + Application
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const result = await createJobAction(body);
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

//* GET all Jobs
export async function GET() {
  try {
    const result = await getJobsAction();

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    )
  }
}