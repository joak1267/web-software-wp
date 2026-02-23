"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { 
  ShieldAlert, 
  Key, 
  Users, 
  Copy, 
  ShieldCheck, 
  Ticket, 
  Activity,
  Plus,
  TrendingUp,
  Award,
  Building2,
  ChevronDown,
  ArrowLeft
} from "lucide-react";

// Conexión a Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const adminEmail = "evidenstalk@gmail.com"; 

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [codigos, setCodigos] = useState<any[]>([]);
  const [generando, setGenerando] = useState(false);
  
  // NUEVO ESTADO: Para mostrar que estamos guardando el nuevo plan
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  // --- AGREGADO: Estados independientes para cada descuento ---
  const [descuentoPericial, setDescuentoPericial] = useState<number>(0);
  const [descuentoInstitucional, setDescuentoInstitucional] = useState<number>(0);
  const [guardandoDescuento, setGuardandoDescuento] = useState(false);

  useEffect(() => {
    if (isLoaded && user?.primaryEmailAddress?.emailAddress === adminEmail) {
      cargarDatos();
    }
  }, [user, isLoaded]);

  const cargarDatos = async () => {
    const { data: perfiles } = await supabase.from("perfiles").select("*");
    if (perfiles) {
      // Ordenamos manualmente por fecha para evitar errores de Supabase
      perfiles.sort((a, b) => new Date(b.creado_en || 0).getTime() - new Date(a.creado_en || 0).getTime());
      setUsuarios(perfiles);
    }

    const { data: promos } = await supabase.from("codigos_promocionales").select("*").order("fecha_creacion", { ascending: false });
    if (promos) setCodigos(promos);

    // --- AGREGADO: Cargar los dos descuentos actuales desde Supabase ---
    const { data: conf } = await supabase.from("configuracion").select("*").eq("id", 1).single();
    if (conf) {
      setDescuentoPericial(conf.descuento_pericial || 0);
      setDescuentoInstitucional(conf.descuento_institucional || 0);
    }
  };

  const generarCodigo = async () => {
    setGenerando(true);
    const codigoRandom = "PERICIAL-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const { error } = await supabase.from("codigos_promocionales").insert({
      codigo: codigoRandom,
      plan_otorgado: "pericial",
      duracion_meses: 12
    });

    if (!error) {
      cargarDatos();
    } else {
      alert("Error generando código");
    }
    setGenerando(false);
  };

  // --- NUEVA FUNCIÓN: Guardar ambos descuentos en Supabase ---
  const guardarDescuentos = async () => {
    setGuardandoDescuento(true);
    const { error } = await supabase.from("configuracion").upsert({ 
      id: 1, 
      descuento_pericial: descuentoPericial,
      descuento_institucional: descuentoInstitucional
    });
    setGuardandoDescuento(false);
    
    if (!error) {
      alert("¡Descuentos aplicados correctamente en la web!");
    } else {
      alert("Error al guardar los descuentos.");
    }
  };

  // --- NUEVA FUNCIÓN: Cambiar el plan manualmente ---
  const cambiarPlanUsuario = async (userId: string, nuevoPlan: string) => {
    setUpdatingUser(userId); // Mostramos "Actualizando..."
    
    // Le sumamos 1 año por defecto si lo pasamos a un plan pago
    const unAnioDesdeHoy = new Date();
    unAnioDesdeHoy.setFullYear(unAnioDesdeHoy.getFullYear() + 1);
    
    const datosActualizar = nuevoPlan === 'comunidad' 
      ? { plan_actual: nuevoPlan, fecha_vencimiento: null } 
      : { plan_actual: nuevoPlan, fecha_vencimiento: unAnioDesdeHoy.toISOString() };

    const { error } = await supabase
      .from("perfiles")
      .update(datosActualizar)
      .eq("id", userId);

    if (!error) {
      await cargarDatos(); // Recargamos las tablas para que el usuario salte de categoría
    } else {
      console.error("Error al cambiar plan:", error);
      alert("Hubo un error al intentar cambiar el plan.");
    }
    
    setUpdatingUser(null); // Ocultamos "Actualizando..."
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-[#0b1325] flex items-center justify-center">
       <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (user?.primaryEmailAddress?.emailAddress !== adminEmail) {
    return (
      <div className="min-h-screen bg-[#0b1325] flex flex-col items-center justify-center text-center p-4">
        <ShieldAlert className="w-24 h-24 text-red-500/80 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Acceso Restringido</h1>
        <p className="text-sky-100/60 text-lg">Área exclusiva para la administración de eVidensTalk.</p>
      </div>
    );
  }

  // --- LÓGICA DE FILTRADO PARA LAS TABLAS ---
  const clientes = usuarios.filter(u => u.email !== adminEmail);
  
  const usuariosComunidad = clientes.filter(u => (u.plan_actual || '').trim().toLowerCase() === 'comunidad');
  const usuariosPericial = clientes.filter(u => (u.plan_actual || '').trim().toLowerCase() === 'pericial');
  const usuariosInstitucional = clientes.filter(u => (u.plan_actual || '').trim().toLowerCase() === 'institucional');

  const totalClientes = clientes.length || 1; 
  const porcentajePago = Math.round(((usuariosPericial.length + usuariosInstitucional.length) / totalClientes) * 100);

  return (
    <div className="min-h-screen bg-[#050914] text-white p-4 md:p-8 font-sans selection:bg-sky-500/30 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex items-center pt-2 pl-2">
          <a href="/" className="flex items-center gap-2 text-sky-100/50 hover:text-sky-400 transition-colors text-sm font-bold uppercase tracking-wider group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Volver a la web
          </a>
        </div>

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0f172a] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.3)]">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight mb-1">Centro de Comando</h1>
              <p className="text-sky-100/50 text-sm font-medium">Panel Maestro de eVidensTalk</p>
            </div>
          </div>
        </header>

        {/* --- NUEVO: PANEL DE DESCUENTOS INDEPENDIENTES --- */}
        <div className="bg-[#0b1325] border border-amber-500/30 rounded-3xl p-6 shadow-[0_0_20px_rgba(245,158,11,0.1)] flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-xl font-bold flex items-center justify-center lg:justify-start gap-2 text-white">
              <Ticket className="w-5 h-5 text-amber-400" /> Gestión de Descuentos
            </h2>
            <p className="text-sky-100/50 text-sm mt-1">Aplica porcentajes independientes para cada plan. Deja en 0 para precio normal.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0f172a] p-4 rounded-2xl border border-white/5 w-full lg:w-auto">
            
            {/* Input Pericial */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span className="text-sky-400 font-bold text-xs uppercase tracking-widest">Pericial:</span>
              <div className="flex items-center bg-[#070b14] rounded-lg border border-white/10 px-2 focus-within:border-sky-500 transition-colors">
                 <input 
                   type="number" 
                   value={descuentoPericial} 
                   onChange={(e) => setDescuentoPericial(Number(e.target.value))} 
                   className="w-14 bg-transparent py-2 text-white text-center font-black focus:outline-none" 
                   min="0" max="100" 
                 />
                 <span className="text-sky-100/30 font-bold pr-1">%</span>
              </div>
            </div>
            
            {/* Input Institucional */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span className="text-indigo-400 font-bold text-xs uppercase tracking-widest">Institucional:</span>
              <div className="flex items-center bg-[#070b14] rounded-lg border border-white/10 px-2 focus-within:border-indigo-500 transition-colors">
                 <input 
                   type="number" 
                   value={descuentoInstitucional} 
                   onChange={(e) => setDescuentoInstitucional(Number(e.target.value))} 
                   className="w-14 bg-transparent py-2 text-white text-center font-black focus:outline-none" 
                   min="0" max="100" 
                 />
                 <span className="text-sky-100/30 font-bold pr-1">%</span>
              </div>
            </div>

            <button 
              onClick={guardarDescuentos} 
              disabled={guardandoDescuento} 
              className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold px-6 py-2 rounded-xl transition-all disabled:opacity-50 w-full sm:w-auto shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            >
              {guardandoDescuento ? "Guardando..." : "Aplicar"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Registros" value={clientes.length} icon={<Users className="w-6 h-6 text-sky-400" />} />
          <StatCard title="Licencias Pagas" value={usuariosPericial.length + usuariosInstitucional.length} icon={<Activity className="w-6 h-6 text-emerald-400" />} />
          <StatCard title="Conversión" value={`${porcentajePago}%`} icon={<TrendingUp className="w-6 h-6 text-indigo-400" />} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-[#0b1325] border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col h-[450px]">
            <div className="flex justify-between mb-8">
              <div><h2 className="text-xl font-bold flex items-center gap-2 text-white"><Key className="w-5 h-5 text-sky-400" /> Códigos Promocionales</h2></div>
              <button onClick={generarCodigo} disabled={generando} className="bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded-xl font-bold transition-all text-sm flex items-center gap-2 disabled:opacity-50">
                {generando ? "Procesando..." : <><Plus className="w-4 h-4" /> Crear</>}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {codigos.map(codigo => (
                <div key={codigo.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#0f172a]/50 border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sky-300 tracking-wider">{codigo.codigo}</span>
                    <button onClick={() => navigator.clipboard.writeText(codigo.codigo)} className="text-sky-100/30 hover:text-white"><Copy className="w-4 h-4" /></button>
                  </div>
                  <div>{codigo.usado ? <span className="text-red-400 text-xs font-bold uppercase">Canjeado</span> : <span className="text-emerald-400 text-xs font-bold uppercase">Disponible</span>}</div>
                </div>
              ))}
              {codigos.length === 0 && <p className="text-center text-sky-100/30 mt-10">No hay códigos.</p>}
            </div>
          </div>

          <div className="bg-[#0b1325] border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col h-[450px]">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white mb-2"><Activity className="w-5 h-5 text-sky-400" /> Flujo de Adquisición</h2>
            <p className="text-sky-100/40 text-sm mb-8">Distribución de usuarios según el plan contratado.</p>
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2"><span className="font-bold text-indigo-400 flex items-center gap-2"><Building2 className="w-4 h-4" /> Institucional</span><span className="text-white font-bold">{usuariosInstitucional.length}</span></div>
                <div className="w-full bg-[#0f172a] rounded-full h-4 overflow-hidden"><div className="bg-indigo-500 h-4 rounded-full" style={{ width: `${Math.max((usuariosInstitucional.length / totalClientes) * 100, 2)}%` }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2"><span className="font-bold text-sky-400 flex items-center gap-2"><Award className="w-4 h-4" /> Pericial</span><span className="text-white font-bold">{usuariosPericial.length}</span></div>
                <div className="w-full bg-[#0f172a] rounded-full h-4 overflow-hidden"><div className="bg-sky-500 h-4 rounded-full" style={{ width: `${Math.max((usuariosPericial.length / totalClientes) * 100, 2)}%` }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2"><span className="font-bold text-sky-100/60 flex items-center gap-2"><Users className="w-4 h-4" /> Comunidad</span><span className="text-white font-bold">{usuariosComunidad.length}</span></div>
                <div className="w-full bg-[#0f172a] rounded-full h-4 overflow-hidden"><div className="bg-white/20 h-4 rounded-full" style={{ width: `${Math.max((usuariosComunidad.length / totalClientes) * 100, 2)}%` }}></div></div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <UserTable 
            titulo="Clientes Institucionales" 
            icono={<Building2 className="w-5 h-5 text-indigo-400" />} 
            colorPill="bg-indigo-500/10 text-indigo-400 border-indigo-500/30" 
            usuarios={usuariosInstitucional} 
            mensajeVacio="Aún no hay instituciones registradas."
            onCambiarPlan={cambiarPlanUsuario}
            updatingUser={updatingUser}
          />
          <UserTable 
            titulo="Licencias Periciales Activas" 
            icono={<Award className="w-5 h-5 text-sky-400" />} 
            colorPill="bg-sky-500/10 text-sky-400 border-sky-500/30" 
            usuarios={usuariosPericial} 
            mensajeVacio="Aún no hay ventas del plan pericial."
            onCambiarPlan={cambiarPlanUsuario}
            updatingUser={updatingUser}
          />
          <UserTable 
            titulo="Usuarios Comunidad" 
            icono={<Users className="w-5 h-5 text-sky-100/50" />} 
            colorPill="bg-white/5 text-white/50 border-white/10" 
            usuarios={usuariosComunidad} 
            mensajeVacio="No hay usuarios gratuitos registrados."
            onCambiarPlan={cambiarPlanUsuario}
            updatingUser={updatingUser}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-[#0b1325] border border-white/5 p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>
      <div className="w-14 h-14 rounded-xl bg-[#0f172a] border border-white/5 flex items-center justify-center relative z-10">{icon}</div>
      <div className="relative z-10"><p className="text-sky-100/50 text-xs font-bold uppercase tracking-wider mb-1">{title}</p><p className="text-3xl font-black text-white">{value}</p></div>
    </div>
  );
}

function UserTable({ 
  titulo, 
  icono, 
  colorPill, 
  usuarios, 
  mensajeVacio, 
  onCambiarPlan, 
  updatingUser 
}: { 
  titulo: string, 
  icono: React.ReactNode, 
  colorPill: string, 
  usuarios: any[], 
  mensajeVacio: string,
  onCambiarPlan: (id: string, plan: string) => void,
  updatingUser: string | null
}) {
  return (
    <div className="bg-[#0b1325] border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2 text-white">{icono} {titulo}</h2>
        <span className="bg-[#0f172a] border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-white">{usuarios.length}</span>
      </div>
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full text-sm border-collapse min-w-[600px] table-fixed">
          <thead>
            <tr className="border-b border-white/10 text-sky-100/50 uppercase tracking-wider text-xs font-bold">
              <th className="pb-4 pl-4 text-left w-1/3">Email del Cliente</th>
              <th className="pb-4 text-center w-1/3">Gestión de Plan</th>
              <th className="pb-4 pr-4 text-right w-1/3">Fecha de Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {usuarios.map(usr => (
              <tr key={usr.id} className="hover:bg-[#0f172a]/50 transition-colors">
                <td className="py-4 pl-4 font-medium text-sky-100 text-left truncate pr-4" title={usr.email}>{usr.email}</td>
                
                <td className="py-4 text-center">
                  {updatingUser === usr.id ? (
                    <span className="inline-block text-[10px] font-black uppercase tracking-widest text-amber-400 animate-pulse">
                      Guardando...
                    </span>
                  ) : (
                    <div className="relative inline-block group">
                      <select
                        value={usr.plan_actual || 'comunidad'}
                        onChange={(e) => onCambiarPlan(usr.id, e.target.value)}
                        className={`appearance-none bg-transparent outline-none cursor-pointer text-center px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border transition-all hover:brightness-125 focus:ring-2 focus:ring-white/20 ${colorPill}`}
                        title="Haz clic para cambiar el plan"
                      >
                        <option value="comunidad" className="bg-[#0f172a] text-white">COMUNIDAD</option>
                        <option value="pericial" className="bg-[#0f172a] text-sky-400">PERICIAL</option>
                        <option value="institucional" className="bg-[#0f172a] text-indigo-400">INSTITUCIONAL</option>
                      </select>
                      <div className="absolute right-[-16px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <ChevronDown className="w-3 h-3 text-white/50" />
                      </div>
                    </div>
                  )}
                </td>

                <td className="py-4 pr-4 text-sky-100/40 text-xs text-right whitespace-nowrap">
                  {new Date(usr.creado_en || Date.now()).toLocaleDateString()} a las {new Date(usr.creado_en || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (<tr><td colSpan={3} className="py-8 text-center text-sky-100/30 text-sm">{mensajeVacio}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}