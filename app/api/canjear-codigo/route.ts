import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

// ⚠️ IMPORTANTE: Usamos la SERVICE_ROLE_KEY para que el servidor tenga permisos absolutos
// y el usuario no pueda manipular las tablas desde el cliente.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    // 1. Validamos que el usuario esté autenticado en Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Debes iniciar sesión para canjear un código.' }, { status: 401 });
    }

    const { promoCode, userEmail } = await req.json();

    if (!promoCode || !userEmail) {
      return NextResponse.json({ error: 'Faltan datos requeridos.' }, { status: 400 });
    }

    const codigoLimpio = promoCode.trim().toUpperCase();

    // 2. Buscamos el código en la base de datos
    const { data: codeData, error: codeError } = await supabase
      .from('codigos_promocionales')
      .select('*')
      .eq('codigo', codigoLimpio)
      .eq('usado', false)
      .single();

    if (codeError || !codeData) {
      return NextResponse.json({ error: 'Código inválido, expirado o ya utilizado.' }, { status: 400 });
    }

    // 3. Marcamos el código como usado
    const { error: updateCodeError } = await supabase
      .from('codigos_promocionales')
      .update({ 
        usado: true, 
        usado_por: userId,
        fecha_uso: new Date().toISOString()
      })
      .eq('id', codeData.id);

    if (updateCodeError) throw updateCodeError;

    // 4. Calculamos el vencimiento y actualizamos el Perfil
    const unAnioDesdeHoy = new Date();
    unAnioDesdeHoy.setFullYear(unAnioDesdeHoy.getFullYear() + 1);

    const { error: updateUserError } = await supabase
      .from('perfiles')
      .update({ 
        plan_actual: codeData.plan_otorgado,
        fecha_vencimiento: unAnioDesdeHoy.toISOString()
      })
      .eq('id', userId);

    if (updateUserError) throw updateUserError;

    // 5. Actualizamos la tabla users (como tenías en tu código original)
    await supabase
      .from('users')
      .update({ plan: codeData.plan_otorgado })
      .eq('email', userEmail);

    // 6. Respondemos con éxito
    return NextResponse.json({ 
      success: true, 
      plan: codeData.plan_otorgado,
      message: `¡Felicidades! Se ha activado tu Plan ${codeData.plan_otorgado.toUpperCase()} por 1 año.`
    });

  } catch (error) {
    console.error("Error en API canjear-codigo:", error);
    return NextResponse.json({ error: 'Hubo un error de conexión con el servidor.' }, { status: 500 });
  }
}