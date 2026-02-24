import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

function generarLicencia() {
  const parte1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const parte2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EVIDENS-${parte1}-${parte2}`;
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response('Error: Falta WEBHOOK_SECRET', { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Faltan headers', { status: 400 });
  }

  // --- EL ARREGLO ESTÁ ACÁ ---
  const body = await req.text(); // Obtenemos el texto bruto para Svix
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error de firma:', err);
    return new Response('Error de verificación', { status: 400 });
  }

  // Ahora que está verificado, procesamos el evento
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    const nombreUsuario = first_name || 'Investigador';
    
    const nuevaLicencia = generarLicencia();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase
      .from('users')
      .insert([{ id, email, plan: 'comunidad', password: nuevaLicencia }]);

    if (error) return new Response('Error Supabase', { status: 500 });

    // Envío a EmailJS con fetch
   try {
      const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        body: JSON.stringify({
          service_id: 'service_jbxfvq7', // Tu Service ID verificado
          template_id: 'template_r9x9yp9', // EL ID QUE VISTE VOS (Correcto)
          user_id: '4GVYXR1W7eanH8yxk',   // Tu Public Key verificada
          template_params: {
            user_email: email,
            user_name: nombreUsuario,
            licencia: nuevaLicencia,
            NOMBRE_PLAN: 'Comunidad (Beta)', // COINCIDE CON TU DISEÑO {{NOMBRE_PLAN}}
            color_plan: '#e2e8f0'
          }
        }), 
        headers: { 'Content-Type': 'application/json' }
      });

      const responseText = await emailRes.text();
      if (!emailRes.ok) {
        console.error('❌ Error de EmailJS:', responseText);
      } else {
        console.log('✉️ Mail enviado con éxito según EmailJS');
      }
    } catch (e) {
      console.error('❌ Fallo total en el fetch de mail:', e);
    }
  }
  return new Response('Webhook OK', { status: 200 });
}