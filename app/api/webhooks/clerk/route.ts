import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// --- NUEVA FUNCIÓN: Genera la licencia automática ---
function generarLicencia() {
  const parte1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const parte2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EVIDENS-${parte1}-${parte2}`;
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Falta agregar WEBHOOK_SECRET en .env.local');
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Faltan los headers de Svix', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verificando webhook:', err);
    return new Response('Error de verificación', { status: 400 });
  }

  const eventType = evt.type;

  // --- ACÁ OCURRE LA MAGIA CUANDO SE REGISTRA ALGUIEN ---
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    const nombreUsuario = first_name || 'Investigador';
    
    // 1. Inventamos la licencia en este milisegundo
    const nuevaLicencia = generarLicencia();
    const planInicial = 'comunidad';

    // Lógica de colores para EmailJS
    const nombre_plan = 'Comunidad (Beta)';
    const color_plan = '#e2e8f0';

    // 2. Nos conectamos a Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 3. Guardamos el usuario, el plan Y LA LICENCIA en la columna password
    const { error } = await supabase
      .from('users')
      .insert([
        { id: id, email: email, plan: planInicial, password: nuevaLicencia }
      ]);

    if (error) {
      console.error('Error al guardar en Supabase:', error);
      return new Response('Error de base de datos', { status: 500 });
    }
    
    console.log(`✅ ÉXITO: Usuario ${email} registrado con licencia ${nuevaLicencia}`);

    // 4. ¡ENVIAMOS EL CORREO CON EMAILJS (Cuenta Oficial)!
    try {
      const emailData = {
        service_id: 'service_jbxfvq7',
        template_id: 'template_r9x9yp9',
        user_id: '4GVYXR1W7eanH8yxk',
        template_params: {
          user_email: email,
          user_name: nombreUsuario,
          licencia: nuevaLicencia,
          nombre_plan: nombre_plan,
          color_plan: color_plan
        }
      };

      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        body: JSON.stringify(emailData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        console.error('Error de EmailJS:', await res.text());
      } else {
        console.log(`✉️ Correo de licencia enviado a ${email} vía EmailJS`);
      }
    } catch (emailError) {
      console.error('Error ejecutando fetch a EmailJS:', emailError);
    }
  }

  return new Response('Webhook procesado', { status: 200 });
}