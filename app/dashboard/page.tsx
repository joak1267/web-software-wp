import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  // 1. Obtenemos los datos del usuario directamente de Clerk
  const user = await currentUser();

  // 2. Si alguien intenta entrar a /dashboard sin iniciar sesión, lo pateamos al inicio
  if (!user) {
    redirect('/');
  }

  // 3. Obtenemos su email principal
  const email = user.emailAddresses[0]?.emailAddress;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-slate-900 rounded-xl shadow-2xl p-8 border border-slate-800 mt-10">
        
        {/* Cabecera del Dashboard */}
        <div className="mb-8 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">
            ¡Bienvenido a tu Panel, {user.firstName || 'Perito'}!
          </h1>
          <p className="text-slate-400">
            Sesión iniciada como: <span className="text-slate-300">{email}</span>
          </p>
        </div>

        {/* Tarjeta de Plan Actual */}
        <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">
              Tu Plan Actual: <span className="text-emerald-400 uppercase ml-2">COMUNIDAD</span>
            </h2>
            <p className="text-slate-400 text-sm">
              Acceso a procesamiento básico. Ideal para estudiantes e investigaciones menores.
            </p>
          </div>
          <button className="bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-950 px-4 py-2 rounded-lg font-semibold transition w-full md:w-auto text-center">
            Mejorar Plan
          </button>
        </div>

        {/* Zona de Descarga */}
        <div className="bg-blue-950/30 border border-blue-900/50 p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-blue-300 mb-4">
            Descarga la última versión de Nexus Layer
          </h3>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-blue-600/20 transition w-full md:w-auto">
            Descargar Software (.exe)
          </button>
          <p className="text-xs text-slate-500 mt-4">
            Versión 1.0 (Beta) - Windows 10/11
          </p>
        </div>

      </div>
    </div>
  );
}