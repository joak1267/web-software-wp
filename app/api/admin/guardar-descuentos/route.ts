import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    // 1. Verificar que sea el Administrador (TÚ)
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user || user.emailAddresses[0]?.emailAddress !== 'evidenstalk@gmail.com') {
      return NextResponse.json({ error: "Acceso denegado." }, { status: 403 });
    }

    // 2. Recibir los porcentajes numéricos que enviaste desde la web
    const { descuentoPericial, descuentoInstitucional } = await request.json();

    // 3. Conectar a Supabase con la LLAVE MAESTRA (Service Role Key)
    // Esto es lo que nos permite editar la tabla aunque no tenga políticas públicas
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 4. Guardar los descuentos en la tabla 'configuracion' (el ID siempre es 1)
    const { error } = await supabase
      .from("configuracion")
      .upsert({ 
        id: 1, 
        descuento_pericial: descuentoPericial,
        descuento_institucional: descuentoInstitucional
      });

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Descuentos guardados" });

  } catch (error) {
    console.error("Error al guardar descuentos:", error);
    return NextResponse.json({ error: "Fallo interno al guardar en la base de datos." }, { status: 500 });
  }
}