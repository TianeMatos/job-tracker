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

import { requireAuth } from "@/lib/auth/auth-session";

export async function GET() {
  try {
    const session = await requireAuth();

    return Response.json({
      authenticated: true,
      userId: session.user.id,
    });
  } catch {
    return Response.json(
      {
        authenticated: false,
        message: "Não autenticado.",
      },
      { status: 401 }
    );
  }
}
