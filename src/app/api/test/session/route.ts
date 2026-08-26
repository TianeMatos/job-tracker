// import { getCurrentSession } from "@/lib/auth-session";

// export async function GET() {
//   const session = await getCurrentSession();

//   if (!session) {
//     return Response.json(
//       {
//         authenticated: false,
//         message: "Usuário não autenticado.",
//       },
//       { status: 401 }
//     );
//   }

//   return Response.json({
//     authenticated: true,
//     user: session.user,
//   });
// }

import { createJobAction } from "@/actions/job";
import { requireAuth } from "@/lib/auth-session";
import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const session = await requireAuth();

//     return Response.json({
//       authenticated: true,
//       userId: session.user.id,
//     });
//   } catch {
//     return Response.json(
//       {
//         authenticated: false,
//         message: "Não autenticado.",
//       },
//       { status: 401 }
//     );
//   }
// }

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Chama a mesma Server Action usada pela UI
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