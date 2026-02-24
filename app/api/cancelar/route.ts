import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    // 1. Seguridad: Verificar que el usuario está logueado en Clerk
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "No autorizado. Debes iniciar sesión." }, { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "No se encontró el email del usuario." }, { status: 400 });
    }

    // 2. Conectar a Mercado Pago
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const preapproval = new PreApproval(client);

    // 3. Buscar si este usuario tiene una suscripción activa (autorizada)
    const searchResult = await preapproval.search({
      options: {
        payer_email: email,
        status: "authorized" // Solo buscamos las que están cobrándose activamente
      }
    });

    const suscripciones = searchResult.results;

    if (!suscripciones || suscripciones.length === 0) {
      return NextResponse.json({ error: "No tienes ninguna suscripción activa para cancelar." }, { status: 404 });
    }

    // 4. Tomar el ID de la suscripción
    const suscripcionId = suscripciones[0].id;

    // Le demostramos a TypeScript que el ID sí existe (Type Guard)
    if (!suscripcionId) {
      return NextResponse.json({ error: "La suscripción encontrada no tiene un ID válido." }, { status: 400 });
    }
    
    // Ahora TypeScript ya no se quejará, porque sabe que es un string seguro
    await preapproval.update({
      id: suscripcionId,
      body: {
        status: "cancelled"
      }
    });

    // 5. (Opcional) Dejar un registro en tu base de datos si lo deseas
    // Por ahora, al cancelar en MP, tu sistema ya no recibirá nuevos pagos.
    // Cuando llegue la fecha de vencimiento actual en Supabase, el usuario perderá el acceso automáticamente.

    return NextResponse.json({ success: true, message: "Suscripción cancelada correctamente. Mantendrás el acceso hasta el fin de tu ciclo de facturación." });

  } catch (error) {
    console.error("Error crítico al cancelar la suscripción:", error);
    return NextResponse.json({ error: "Hubo un error al intentar cancelar tu plan." }, { status: 500 });
  }
}