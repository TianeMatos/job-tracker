import { deleteJobAction, getJobAction, updateJobAction } from "@/actions/job";
import { UpdateJobInput } from "@/schemas/job";
import { NextResponse } from "next/server";

//* GET one Job
export async function GET(request: Request, { params }: { params: Promise<{ id: string}> }) {
  try {
    const { id } = await params;
    const result = await getJobAction(id);

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

//* UPDATE one Job
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body: UpdateJobInput = await request.json();
    const result = await updateJobAction(id, body);

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

//* DELITE one Job
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await deleteJobAction(id);

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