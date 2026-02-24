import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    // 1. VERIFICACIÓN DE SEGURIDAD EXTREMA
    const { userId } = await auth();
    const user = await currentUser();

    // Comprobamos que esté logueado y que sea EXACTAMENTE tu correo
    if (!userId || !user || user.emailAddresses[0]?.emailAddress !== 'evidenstalk@gmail.com') {
      return NextResponse.json({ error: "Acceso denegado. No eres administrador." }, { status: 403 });
    }

    // 2. Recibir los datos desde el panel admin
    const { targetUserId, targetUserEmail, nuevoPlan } = await request.json();

    if (!targetUserId || !targetUserEmail || !nuevoPlan) {
      return NextResponse.json({ error: "Faltan datos requeridos." }, { status: 400 });
    }

    // 3. Conectarse a Supabase usando la CLAVE MAESTRA (Service Role Key)
    // Esto ignora las políticas RLS y nos permite editar lo que queramos de forma segura
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // 🔥 CLAVE MAESTRA
    );

    // 4. Lógica de fechas (1 año extra si es de pago)
    const unAnioDesdeHoy = new Date();
    unAnioDesdeHoy.setFullYear(unAnioDesdeHoy.getFullYear() + 1);
    
    const datosActualizar = nuevoPlan === 'comunidad' 
      ? { plan_actual: nuevoPlan, fecha_vencimiento: null } 
      : { plan_actual: nuevoPlan, fecha_vencimiento: unAnioDesdeHoy.toISOString() };

    // 5. ACTUALIZAR TABLA USERS (Software)
    const { error: errorUsers } = await supabase
      .from("users")
      .update({ plan: nuevoPlan })
      .eq("email", targetUserEmail);

    if (errorUsers) throw errorUsers;

    // 6. ACTUALIZAR TABLA PERFILES (Web)
    const { error: errorPerfiles } = await supabase
      .from("perfiles")
      .update(datosActualizar)
      .eq("id", targetUserId);

    if (errorPerfiles) throw errorPerfiles;

    return NextResponse.json({ success: true, message: "Plan actualizado correctamente en ambas bases de datos." });

  } catch (error) {
    console.error("Error crítico en API de admin:", error);
    return NextResponse.json({ error: "Fallo interno al actualizar base de datos." }, { status: 500 });
  }
}