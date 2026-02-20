import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

export async function POST(request: Request) {
  try {
    // 1. Definir un "Plan B" por si la API del dólar se cae
    let precioDolar = 1000; // Podés actualizar este número a ojo cada tanto

    // 2. Intentar buscar el dólar real (ahora más protegido contra bloqueos)
    try {
      const dolarResponse = await fetch("https://dolarapi.com/v1/dolares/mep", { 
        cache: "no-store",
        headers: {
          "Accept": "application/json",
          "User-Agent": "eVidensTalk-App" // Le decimos quiénes somos para que no nos bloquee
        }
      });
      
      // Si la API nos respondió bien (Status 200)
      if (dolarResponse.ok) {
        const dolarData = await dolarResponse.json();
        if (dolarData && dolarData.venta) {
          precioDolar = dolarData.venta; // Pisamos el Plan B con el precio real
        }
      } else {
        console.log("DolarAPI no respondió bien. Usando dólar de respaldo.");
      }
    } catch (apiError) {
      console.log("Fallo la conexión a DolarAPI. Usando dólar de respaldo.");
    }

    // 3. Definir tu precio en dólares y calcular el total en pesos
    const PRECIO_EN_DOLARES = 1; 
    const precioEnPesos = Math.round(PRECIO_EN_DOLARES * precioDolar);

   // 4. Conectarse a tu Mercado Pago con la llave secreta
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const preference = new Preference(client);

    // 5. Armar el "carrito de compras" con URLs que Mercado Pago entienda
    const result = await preference.create({
      body: {
        items: [
          {
            id: "licencia-pericial-v1",
            title: "eVidensTalk - Licencia Pericial",
            quantity: 1,
            unit_price: precioEnPesos,
            currency_id: "ARS",
            description: "Licencia de software forense (Pago único)",
          }
        ],
        // IMPORTANTE: Mercado Pago exige que estas URLs existan y sean válidas
        back_urls: {
          success: "https://www.google.com", 
          failure: "https://www.google.com",
          pending: "https://www.google.com",
        },
        auto_return: "approved", // Esto ahora sí va a funcionar
      }
    });

    // 6. Devolverle a la página web el link seguro de pago
    return NextResponse.json({ url: result.init_point });
    
  } catch (error) {
    console.error("Error crítico al generar el pago:", error);
    return NextResponse.json({ error: "No se pudo crear el pago" }, { status: 500 });
  }
}