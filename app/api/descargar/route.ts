import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Consultamos la API pública de GitHub para obtener tu último "Release"
    // (Reemplaza 'joak1267/evidenstalk-enterprise' si alguna vez cambias el nombre del repo)
    const res = await fetch('https://api.github.com/repos/joak1267/evidenstalk-enterprise/releases/latest', {
      // Usamos caché de Next.js para no saturar la API de GitHub si hay muchas descargas de golpe
      next: { revalidate: 300 } // Revalida la información cada 5 minutos
    });

    if (!res.ok) {
      throw new Error('No se pudo comunicar con GitHub');
    }

    const data = await res.json();

    // 2. Buscamos automáticamente el archivo que termine en ".exe" dentro de ese release
    const instaladorExe = data.assets.find((asset: any) => asset.name.endsWith('.exe'));

    if (!instaladorExe) {
      // Si un día subes un release pero se te olvida adjuntar el .exe, los enviamos a la página de GitHub
      return NextResponse.redirect('https://github.com/joak1267/evidenstalk-enterprise/releases/latest');
    }

    // 3. Redirigimos al usuario al link real de descarga del último .exe
    return NextResponse.redirect(instaladorExe.browser_download_url);

  } catch (error) {
    console.error("Error en API de descarga:", error);
    // Fallback: Si GitHub se cae, los mandamos a tu página de releases manual
    return NextResponse.redirect('https://github.com/joak1267/evidenstalk-enterprise/releases/latest');
  }
}