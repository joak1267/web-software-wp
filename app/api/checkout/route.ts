import { NextResponse } from "next/server";
import { MercadoPagoConfig, PreApproval } from "mercadopago";

export async function POST(request: Request) {
  try {
    // 1. Recibir datos desde el frontend (¡AHORA INCLUYE EL EMAIL DEL USUARIO!)
    const body = await request.json();
    const { plan, ciclo, descuento, email } = body;

    if (!email) {
      return NextResponse.json({ error: "El email del usuario es obligatorio para crear una suscripción." }, { status: 400 });
    }

    // 2. Configuración de precios y lógica de negocio
    const valorDolarFijo = 1400; 
    let precioDolares = 0;
    let tituloItem = "";
    let urlExito = "";
    const dominioReal = "https://evidenstalk.vercel.app"; 

    if (plan === "pericial") {
      precioDolares = ciclo === "anual" ? 239.99 : 19.99;
      tituloItem = `eVidensTalk - Licencia Pericial (${ciclo === "anual" ? "Anual" : "Mensual"})`;
      urlExito = `${dominioReal}/pago-exitoso`; 
    } else if (plan === "institucional") {
      precioDolares = ciclo === "anual" ? 1200 : 100;
      tituloItem = `eVidensTalk - Licencia Institucional (${ciclo === "anual" ? "Anual" : "Mensual"})`;
      urlExito = `${dominioReal}/pago-exitoso-institucional`;
    } else {
      return NextResponse.json({ error: "Plan no válido." }, { status: 400 });
    }

    // Aplicar descuento si existe
    if (descuento && descuento > 0) {
      precioDolares = precioDolares - (precioDolares * (descuento / 100));
      tituloItem += ` (${descuento}% OFF)`;
    }

    const precioEnPesos = Math.round(precioDolares * valorDolarFijo);

    // 3. Conexión con Mercado Pago
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    
    // 🔥 CAMBIO CLAVE: Usamos PreApproval en lugar de Preference
    const preapproval = new PreApproval(client);

    // 4. Crear la suscripción (PreApproval)
    const result = await preapproval.create({
      body: {
        reason: tituloItem,
        // external_reference es clave para identificar de qué usuario y plan es este pago cuando MercadoPago nos avise por Webhook
        external_reference: `${email}|${plan}|${ciclo}`,
        payer_email: email,
        auto_recurring: {
          frequency: 1,
          frequency_type: ciclo === "anual" ? "years" : "months", // Se cobra 1 vez al año o 1 vez al mes
          transaction_amount: precioEnPesos,
          currency_id: "ARS",
        },
        back_url: urlExito,
        status: "pending",
      }
    });

    // 5. Devolverle a la página web el link seguro para suscribirse
    return NextResponse.json({ url: result.init_point });
    
  } catch (error) {
    console.error("Error crítico al generar la suscripción:", error);
    return NextResponse.json({ error: "No se pudo crear la suscripción" }, { status: 500 });
  }
}