import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  // 1. Obtenemos la clave secreta del Webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Falta agregar WEBHOOK_SECRET en .env.local');
  }

  // 2. Obtenemos los headers para verificar la seguridad (CORREGIDO PARA NEXT.JS 15)
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Faltan los headers de Svix', { status: 400 });
  }

  // 3. Obtenemos el cuerpo del mensaje
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // 4. Verificamos que la firma sea auténtica usando Svix
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

  // 5. Si es un usuario nuevo, lo guardamos en Supabase
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses } = evt.data;
    const email = email_addresses[0]?.email_address;

    // Nos conectamos a Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insertamos la fila en la tabla 'users'
    const { error } = await supabase
      .from('users')
      .insert([
        { id: id, email: email, plan: 'comunidad' }
      ]);

    if (error) {
      console.error('Error al guardar en Supabase:', error);
      return new Response('Error de base de datos', { status: 500 });
    }
    
    console.log(`Usuario guardado con éxito: ${email}`);
  }

  return new Response('Webhook procesado', { status: 200 });
}