import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

export async function POST(request: Request) {
  try {
    // 1. Recibir el plan, ciclo y descuento desde el frontend
    const { plan, ciclo, descuento } = await request.json();

    // 2. Configuración de precios y lógica de negocio
    const valorDolarFijo = 1400; // Valor solicitado
    let precioDolares = 0;
    let tituloItem = "";
    let urlExito = "";
    const dominioReal = "https://evidenstalk.vercel.app"; // Tu dominio

    if (plan === "pericial") {
      precioDolares = ciclo === "anual" ? 239.99 : 19.99; // Precio mensual o anual
      tituloItem = `eVidensTalk - Licencia Pericial (${ciclo === "anual" ? "1 Año" : "1 Mes"})`;
      urlExito = `${dominioReal}/pago-exitoso`; 
    } else if (plan === "institucional") {
      precioDolares = ciclo === "anual" ? 1200 : 100; // Precio mensual o anual
      tituloItem = `eVidensTalk - Licencia Institucional (${ciclo === "anual" ? "1 Año" : "1 Mes"})`;
      urlExito = `${dominioReal}/pago-exitoso-institucional`;
    }

    // Aplicar descuento si existe y es mayor a 0
    if (descuento && descuento > 0) {
      precioDolares = precioDolares - (precioDolares * (descuento / 100));
      tituloItem += ` (${descuento}% OFF)`;
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
            id: `licencia-${plan}-${ciclo || 'mensual'}`,
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