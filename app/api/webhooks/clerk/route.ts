import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Función para generar la licencia
function generarLicencia() {
  const parte1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const parte2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EVIDENS-${parte1}-${parte2}`;
}

export async function POST(req: Request) {
  // 1. Verificación de secretos del Webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Falta WEBHOOK_SECRET en las variables de entorno");
    return new Response('Error: Falta WEBHOOK_SECRET', { status: 500 });
  }

  // 2. Extracción de Headers de Svix
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Faltan headers de Svix', { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  // 3. Verificación de la firma del Webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verificando la firma del webhook:', err);
    return new Response('Error de verificación', { status: 400 });
  }

  const eventType = evt.type;

  // 4. Lógica para cuando se crea un usuario (Registro)
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name } = evt.data;
    
    // Obtenemos el email principal
    const email = email_addresses && email_addresses.length > 0 
      ? email_addresses[0].email_address 
      : null;
      
    const nombreUsuario = first_name || 'Investigador';
    
    if (!email) {
       console.error("El usuario creado no tiene email asociado.");
       return new Response('Usuario sin email', { status: 400 });
    }

    const nuevaLicencia = generarLicencia();

    // 5. Conexión a Supabase (Usando Service Role Key obligatoriamente para seguridad)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 6. Inserción en las tablas 'users' y 'perfiles'
    // Primero en users
    const { error: errorUsers } = await supabase
      .from('users')
      .insert([{ 
        id: id, 
        email: email, 
        plan: 'comunidad', 
        password: nuevaLicencia 
      }]);

    if (errorUsers) {
       console.error('Error insertando en tabla users:', errorUsers);
       return new Response('Error Base de Datos', { status: 500 });
    }

    // Luego en perfiles (esto reemplaza al viejo código de tu frontend)
    const { error: errorPerfiles } = await supabase
      .from('perfiles')
      .insert([{ 
        id: id, 
        email: email, 
        plan_actual: 'comunidad' 
      }]);

    if (errorPerfiles) {
       console.error('Error insertando en tabla perfiles:', errorPerfiles);
       return new Response('Error Base de Datos', { status: 500 });
    }

    // 7. Envío de Email mediante EmailJS (Usando variables de entorno)
    try {
      // Obtenemos credenciales desde el .env
      const emailJsServiceId = process.env.EMAILJS_SERVICE_ID || 'service_jbxfvq7';
      const emailJsTemplateId = process.env.EMAILJS_TEMPLATE_ID || 'template_r9x9yp9';
      const emailJsUserId = process.env.EMAILJS_USER_ID || '4GVYXR1W7eanH8yxk';
      const emailJsAccessToken = process.env.EMAILJS_ACCESS_TOKEN || 'thK8SJc0fPCflvz5MUMmG';

      const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        body: JSON.stringify({
          service_id: emailJsServiceId,
          template_id: emailJsTemplateId,
          user_id: emailJsUserId,
          accessToken: emailJsAccessToken,
          template_params: {
            user_email: email,
            user_name: nombreUsuario,
            licencia: nuevaLicencia,
            NOMBRE_PLAN: 'Comunidad (Beta)',
            nombre_plan: 'Comunidad (Beta)',
            color_plan: '#e2e8f0'
          }
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const responseText = await emailRes.text();
      if (!emailRes.ok) {
        console.error('❌ Error de EmailJS al enviar:', responseText);
      } else {
        console.log(`✅ Mail de bienvenida enviado con éxito a ${email}`);
      }
    } catch (e) {
      console.error('❌ Error de red conectando con EmailJS:', e);
    }
  }

  // 8. Respuesta exitosa para Clerk
  return new Response('Webhook procesado exitosamente', { status: 200 });
}