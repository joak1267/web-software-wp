import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

export async function POST(request: Request) {
  try {
    // 1. Recibir el plan desde el frontend
    const { plan } = await request.json();

    // 2. Configuración de precios y lógica de negocio
    const valorDolarFijo = 1400; // Valor solicitado
    let precioDolares = 0;
    let tituloItem = "";
    let urlExito = "";
    const dominioReal = "https://evidenstalk.vercel.app"; // Tu dominio

    if (plan === "pericial") {
      precioDolares = 19.99; // Precio solicitado
      tituloItem = "eVidensTalk - Licencia Pericial";
      urlExito = `${dominioReal}/pago-exitoso`; 
    } else if (plan === "institucional") {
      precioDolares = 100; // Precio solicitado
      tituloItem = "eVidensTalk - Licencia Institucional";
      urlExito = `${dominioReal}/pago-exitoso-institucional`;
    }

    const precioEnPesos = Math.round(precioDolares * valorDolarFijo);

    // 3. Conexión con Mercado Pago usando tu token de producción
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const preference = new Preference(client);

    // 4. Crear la preferencia de pago
    const result = await preference.create({
      body: {
        items: [
          {
            id: `licencia-${plan}`,
            title: tituloItem,
            quantity: 1,
            unit_price: precioEnPesos,
            currency_id: "ARS",
            description: `Licencia de software forense - Plan ${plan}`,
          }
        ],
        back_urls: {
          success: urlExito,
          failure: dominioReal,
          pending: urlExito,
        },
        auto_return: "approved",
      }
    });

    // 5. Devolverle a la página web el link seguro de pago
    return NextResponse.json({ url: result.init_point });
    
  } catch (error) {
    console.error("Error crítico al generar el pago:", error);
    return NextResponse.json({ error: "No se pudo crear el pago" }, { status: 500 });
  }
}