import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    // 1. Capturamos los datos que Mercado Pago nos envía en la URL o en el Body
    const url = new URL(request.url);
    const topic = url.searchParams.get('topic') || url.searchParams.get('type');
    const id = url.searchParams.get('data.id') || url.searchParams.get('id');

    const body = await request.json().catch(() => ({}));
    
    // Mercado Pago puede enviar eventos de distintas formas (Webhooks o IPN)
    const eventType = topic || body.type || body.action;
    const paymentId = id || body.data?.id;

    // 2. Solo nos interesan los eventos de "pagos"
    if (eventType === 'payment' && paymentId) {
      
      // 3. NUNCA confiamos a ciegas. Vamos a preguntarle a Mercado Pago si este pago es real.
      const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: paymentId });

      // 4. Verificamos si la tarjeta pasó correctamente y está "aprobado"
      if (paymentData.status === 'approved') {
        
        // 5. ¡Acá está la magia! Recuperamos la etiqueta secreta que armamos en el Checkout
        const externalReference = paymentData.external_reference;
        
        if (externalReference) {
          // Separamos el string: "usuario@email.com|pericial|mensual"
          const [email, plan, ciclo] = externalReference.split('|');

          // 6. Calculamos la nueva fecha de vencimiento según lo que pagó
          const fechaVencimiento = new Date();
          if (ciclo === 'anual') {
            fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 1);
          } else {
            fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 1);
          }

          // 7. Nos conectamos a Supabase como Administradores (Service Role)
          const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
          const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, supabaseKey);

          // 8. Actualizamos al usuario en la base de datos de forma automática
          const { error } = await supabase
            .from('perfiles')
            .update({
              plan_actual: plan,
              fecha_vencimiento: fechaVencimiento.toISOString()
            })
            .eq('email', email); // Buscamos por su correo

          if (error) {
            console.error('❌ Error actualizando Supabase:', error);
            // Si falla la BD, le avisamos a MP que hubo un error interno
            return NextResponse.json({ error: 'Error actualizando Base de Datos' }, { status: 500 });
          }

          console.log(`✅ ¡Venta exitosa! Plan ${plan.toUpperCase()} activado para ${email}`);
        }
      }
    }

    // 9. Siempre hay que devolverle un "200 OK" rápido a Mercado Pago para que sepa que lo recibimos
    // y no nos vuelva a enviar la misma notificación 50 veces.
    return NextResponse.json({ received: true }, { status: 200 });
    
  } catch (error) {
    console.error('❌ Error general en el Webhook de Mercado Pago:', error);
    return NextResponse.json({ error: 'Fallo al procesar el webhook' }, { status: 500 });
  }
}