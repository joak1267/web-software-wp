"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';
import { createClient } from "@supabase/supabase-js";
import { 
  Bug,
  Mail, 
  Download, 
  ShieldCheck, 
  FileText, 
  Lock, 
  CheckCircle2, 
  Search,
  ChevronDown,
  Briefcase,
  User,
  Ticket,
  Key
} from "lucide-react";

// --- IMPORTAMOS EL NUEVO COMPONENTE DE LICENCIA ---
import LicenseTab from './components/LicenseTab';

// --- CONEXIÓN A SUPABASE ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- CONFIGURACIÓN DE PRECIOS BASE ---
const PRECIOS = {
  pericial: { mensual: 19.99, anual: 239.99 },
  institucional: { mensual: 100, anual: 1200 }
};

// --- CONFIGURACIÓN DE ANIMACIONES ---
const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const [flujoActivo, setFlujoActivo] = useState<'comunidad' | 'pericial' | 'institucional'>('pericial');

  // --- ESTADOS: CANJE Y LECTURA DE PLAN ---
  const [planActual, setPlanActual] = useState("cargando...");
  const [promoCode, setPromoCode] = useState("");
  const [redeemStatus, setRedeemStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [redeemMessage, setRedeemMessage] = useState("");

  const [isCancelling, setIsCancelling] = useState(false);
  
  // --- NUEVO ESTADO: LICENCIA ---
  const [licencia, setLicencia] = useState("Cargando licencia...");

  // ESTADO NUEVO: Controla si se muestra el precio mensual o anual
  const [cicloFacturacion, setCicloFacturacion] = useState<'mensual' | 'anual'>('mensual');

  // ESTADOS NUEVOS: Descuentos leídos desde Supabase
  const [descuentoPericial, setDescuentoPericial] = useState(0);
  const [descuentoInstitucional, setDescuentoInstitucional] = useState(0);

  // Variable para forzar visualmente el panel Admin
  const isAdmin = user?.primaryEmailAddress?.emailAddress === "evidenstalk@gmail.com";


  // --- ESCÁNER DE SUPABASE ACTUALIZADO (FUENTE DE LA VERDAD UNIFICADA) ---
  useEffect(() => {
    const cargarDescuentos = async () => {
      const { data } = await supabase.from('configuracion').select('*').eq('id', 1).single();
      if (data) {
        setDescuentoPericial(data.descuento_pericial || 0);
        setDescuentoInstitucional(data.descuento_institucional || 0);
      }
    };
    cargarDescuentos();

    if (user) {
      const sincronizarUsuario = async () => {
        const email = user.primaryEmailAddress?.emailAddress;
        if (!email) return;

        // El frontend AHORA SOLO LEE de la base de datos
        const { data: userData } = await supabase
          .from('users')
          .select('password, plan')
          .eq('email', email)
          .single();
        
        if (userData) {
          setLicencia(userData.password || "LICENCIA-NO-ENCONTRADA");
          setPlanActual(userData.plan || "comunidad");
        } else {
          setLicencia("LICENCIA-NO-ENCONTRADA");
          setPlanActual("comunidad");
        }
        
        // ¡Listo! Ya no hay 'upsert' aquí. El Webhook de Clerk se encarga de crearlo.
      };
      
      sincronizarUsuario();
    }
  }, [user]);

  // --- LÓGICA DE CANJEO DE CÓDIGO PROMOCIONAL (SEGURA VÍA API) ---
  const handleRedeemCode = async () => {
    if (!promoCode.trim()) return;
    setRedeemStatus('loading');
    setRedeemMessage("");

    try {
      const res = await fetch('/api/canjear-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          promoCode: promoCode,
          userEmail: user?.primaryEmailAddress?.emailAddress
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error desconocido al canjear el código.");
      }

      // Si todo sale bien, actualizamos la interfaz
      setRedeemStatus('success');
      setRedeemMessage(data.message);
      setPlanActual(data.plan); 
      setPromoCode(""); 

    } catch (error: any) {
      console.error("Error canjeando código:", error);
      setRedeemStatus('error');
      setRedeemMessage(error.message);
    }
  };

  // --- DATOS DEL FLUJO (CARRUSEL) ---
  const DATOS_FLUJO = {
    comunidad: {
      tema: { texto: "text-slate-400", bg: "bg-slate-500/10", borde: "border-slate-500/30", gradiente: "from-slate-500/5", color: "slate" },
      pasos: [
        { 
          titulo: "Carga Básica", 
          desc: "Sube tu exportación de WhatsApp en formato .txt (hasta 15k mensajes). El sistema estructurará el chat para su lectura.", 
          icono: <Download className="w-8 h-8" />,
          imgText: "[Imagen: Carga básica de .txt]"
        },
        { 
          titulo: "Búsqueda Simple", 
          desc: "Utiliza el buscador integrado para encontrar palabras clave dentro de la conversación sin indexación profunda.", 
          icono: <Search className="w-8 h-8" />,
          imgText: "[Imagen: Buscador estándar]"
        },
        { 
          titulo: "PDF con Marca de Agua", 
          desc: "Genera un reporte básico en PDF para revisión personal, incluyendo una marca de agua de la versión de la comunidad.", 
          icono: <FileText className="w-8 h-8" />,
          imgText: "[Imagen: PDF Básico]"
        }
      ]
    },
    pericial: {
      tema: { texto: "text-sky-400", bg: "bg-sky-500/10", borde: "border-sky-500/30", gradiente: "from-sky-500/5", color: "sky" },
      pasos: [
        { 
          titulo: "Exporta y Carga el Chat", 
          desc: "Solicita la exportación del chat de WhatsApp directamente desde el dispositivo móvil (formato .txt o .zip). Arrastra el archivo a eVidensTalk y el sistema lo estructurará automáticamente de forma cronológica, separando emisores y receptores.", 
          icono: <Download className="w-8 h-8" />,
          imgText: "[Imagen: Pantalla de carga masiva]"
        },
        { 
          titulo: "Audita y Etiqueta", 
          desc: "Utiliza el motor de búsqueda global para encontrar palabras clave al instante. Escucha notas de voz integradas, transcribe audios largos y marca mensajes específicos con la etiqueta Evidencia para incluirlos en el reporte final.", 
          icono: <Search className="w-8 h-8" />,
          imgText: "[Imagen: Interfaz de etiquetado pericial]"
        },
        { 
          titulo: "Genera el Reporte Forense", 
          desc: "Exporta un documento PDF impecable listo para el juzgado. El reporte incluye automáticamente la fecha, hora, metadatos del archivo original y las firmas Hash (MD5/SHA256) para garantizar la inalterabilidad de la evidencia.", 
          icono: <FileText className="w-8 h-8" />,
          imgText: "[Imagen: PDF Forense con Hashes]"
        }
      ]
    },
    institucional: {
      tema: { texto: "text-indigo-400", bg: "bg-indigo-500/10", borde: "border-indigo-500/30", gradiente: "from-indigo-500/5", color: "indigo" },
      pasos: [
        { 
          titulo: "Ingesta Multi-Dispositivo", 
          desc: "Procesa extracciones de múltiples fuentes y agentes simultáneos, ideal para investigaciones complejas en fuerzas de seguridad o grandes estudios.", 
          icono: <Briefcase className="w-8 h-8" />,
          imgText: "[Imagen: Dashboard Multi-Agente]"
        },
        { 
          titulo: "Colaboración y Auditoría", 
          desc: "Etiquetado avanzado y categorización para equipos de trabajo. Mantén un registro de auditoría de quién revisó cada porción de la evidencia.", 
          icono: <ShieldCheck className="w-8 h-8" />,
          imgText: "[Imagen: Log de Auditoría]"
        },
        { 
          titulo: "Reporte Marca Blanca", 
          desc: "Genera el PDF forense final con el logo, membrete y formato oficial de tu institución, manteniendo las garantías de firmas Hash.", 
          icono: <FileText className="w-8 h-8" />,
          imgText: "[Imagen: PDF Institucional Personalizado]"
        }
      ]
    }
  };

  const handleCheckout = async (planName: string) => {
    if (!userId) {
      toast.error("Para adquirir una licencia, primero debes iniciar sesión.");
      return;
    }

    setIsCheckingOut(true);
    try {
      const descuentoAplicado = planName === 'pericial' ? descuentoPericial : descuentoInstitucional;
      const res = await fetch('/api/checkout', { 
        method: 'POST',
        body: JSON.stringify({ 
          plan: planName,
          ciclo: cicloFacturacion,
          descuento: descuentoAplicado,
          email: user?.primaryEmailAddress?.emailAddress
        }) 
      });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Hubo un error generando el link de pago.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error de conexión con el servidor.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // --- LÓGICA DE CANCELACIÓN DE SUSCRIPCIÓN ---
  const handleCancelSubscription = async () => {
    // Mantenemos el confirm nativo para la advertencia crítica, es buena práctica
    const confirmar = window.confirm("¿Estás seguro de que deseas cancelar tu suscripción? Podrás seguir usando eVidensTalk hasta el final de tu ciclo de facturación actual.");
    
    if (!confirmar) return;

    setIsCancelling(true);
    try {
      const res = await fetch('/api/cancelar', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        // Esperamos 2 segundos para que el usuario lea el Toast antes de recargar la página
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast.error(data.error || "No se pudo cancelar la suscripción.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión al intentar cancelar.");
    } finally {
      setIsCancelling(false);
    }
  };

  // --- NUEVA LÓGICA DE DESCARGA DIRECTA ---
// --- NUEVA LÓGICA DE DESCARGA DIRECTA (DINÁMICA) ---
const handleDirectDownload = () => {
  toast.success("Iniciando descarga de la última versión...");
  
  // Esto redirige silenciosamente a nuestra nueva API.
  // La API buscará el último .exe en GitHub y comenzará la descarga sola.
  window.location.href = '/api/descargar';
};

  const calcularPrecioFinal = (precioBase: number, descuento: number) => {
    if (descuento > 0) {
      return (precioBase - (precioBase * (descuento / 100))).toFixed(2);
    }
    return precioBase.toFixed(2);
  };

  return (
    <div className="relative min-h-screen bg-[#0b1325] selection:bg-sky-500/30 font-sans">
      
      {/* --- NOTIFICACIONES TOAST --- */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#fff',
            border: '1px solid rgba(14, 165, 233, 0.2)', // Borde sutil celeste
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      
     {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full glass-panel z-50 border-b-0 border-white/5 bg-[#0b1325]/80 backdrop-blur-md h-16">
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between relative">
          
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="eVidensTalk Logo" 
              className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]" 
            />
            <span className="font-semibold tracking-tight text-white">
              <span className="text-cyan-400">e</span>VidensTalk
            </span>
          </div>

          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 text-sm font-medium text-neutral-400">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-sky-400 transition-colors">
              Inicio
            </button>
            <a href="#features" className="hover:text-sky-400 transition-colors">Características</a>
            <a href="#planes" className="hover:text-sky-400 transition-colors">Planes</a>
            <a href="#soporte" className="hover:text-sky-400 transition-colors">Contacto</a>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 text-sm font-medium border border-sky-500/30 bg-sky-500/10 px-4 py-2 rounded-full hover:bg-sky-500/20 transition-colors text-sky-400">
                  <Lock className="w-4 h-4" />
                  <span className="hidden sm:inline">Iniciar Sesión</span>
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              {isAdmin && (
                <a 
                  href="/admin" 
                  className="hidden sm:flex items-center gap-2 text-sm font-bold border border-amber-500/50 bg-amber-500/10 px-4 py-2 rounded-full text-amber-400 hover:bg-amber-500/20 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </a>
              )}
              <div className="relative flex items-center justify-center w-10 h-10 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-all shadow-[0_0_10px_rgba(14,165,233,0.1)] group cursor-pointer">
                
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                
                <div className="absolute inset-0 z-10 opacity-0">
                  <UserButton 
                    afterSignOutUrl="/" 
                    appearance={{
                      elements: {
                        rootBox: "w-full h-full flex",
                        userButtonTrigger: "w-full h-full",
                        avatarBox: "w-full h-full"
                      }
                    }}
                  >
                    <UserButton.UserProfilePage 
                      label="Mi Licencia" 
                      url="licencia" 
                      labelIcon={<Key className="w-4 h-4" />}
                    >
                      <LicenseTab licencia={licencia} />
                    </UserButton.UserProfilePage>
                    
                  <UserButton.UserProfilePage 
                    label="Suscripción y Plan" 
                    url="suscripcion" 
                    labelIcon={<Briefcase className="w-4 h-4" />}
                  >
                    <div className="p-8 font-sans">
                      <h2 className="text-2xl font-bold text-white mb-6">Gestión de Suscripción</h2>
                      
                      <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 mb-8 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-2xl rounded-full pointer-events-none"></div>
                        
                        <p className="text-sm font-semibold text-sky-100/50 mb-2">Plan Actual</p>
                        <div className="flex items-center gap-3">
                          <span className={`text-3xl font-black uppercase tracking-wide drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]
                            ${isAdmin ? 'text-amber-400' : planActual === 'pericial' ? 'text-sky-400' : planActual === 'institucional' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                            {isAdmin ? 'ADMIN' : planActual}
                          </span>
                          <span className={`border px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                            ${isAdmin ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                            Activo
                          </span>
                        </div>
                        <p className="text-sm text-sky-100/70 mt-4 leading-relaxed relative z-10">
                          {isAdmin
                            ? 'Cuenta de administrador con control total sobre las configuraciones y herramientas premium de eVidensTalk.'
                            : planActual === 'comunidad'
                            ? 'Tienes acceso a las herramientas de procesamiento básico. El plan no tiene fecha de vencimiento y es completamente gratuito.'
                            : 'Tienes acceso total a las funciones avanzadas, procesamiento ilimitado y firmas Hash de eVidensTalk.'}
                        </p>
                      </div>

                      <div className="mb-8 bg-[#070b14]/50 border border-white/5 rounded-xl p-5 relative group hover:border-white/10 transition-colors">
                        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-amber-500 to-transparent rounded-l-xl opacity-50"></div>
                        
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2 pl-2">
                          <Ticket className="w-4 h-4 text-amber-400" />
                          Canjear Código Promocional
                        </h3>
                        
                        <div className="flex flex-col sm:flex-row gap-2 pl-2">
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            placeholder="EJ: PERICIAL-A1B2C3"
                            className="flex-1 bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-sky-100/30 focus:outline-none focus:border-amber-500/50 transition-colors uppercase font-mono text-sm tracking-widest shadow-inner"
                          />
                          <button
                            onClick={handleRedeemCode}
                            disabled={redeemStatus === 'loading' || !promoCode.trim()}
                            className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold py-2.5 px-6 rounded-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                          >
                            {redeemStatus === 'loading' ? 'Validando...' : 'Canjear'}
                          </button>
                        </div>
                        
                        {redeemMessage && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                            className={`mt-3 pl-2 text-xs font-bold ${redeemStatus === 'success' ? 'text-emerald-400' : 'text-red-400'}`}
                          >
                            {redeemMessage}
                          </motion.p>
                        )}
                      </div>

                      <div className="mb-8">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-sky-400" />
                          Opciones de la Cuenta
                        </h3>
                        
                        <div className="bg-[#070b14]/50 border border-white/5 rounded-xl p-5 relative group hover:border-white/10 transition-colors">
                          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-sky-500 to-transparent rounded-l-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                          
                          <p className="text-sm text-sky-100/60 leading-relaxed pl-2">
                            Para desbloquear funciones avanzadas como <span className="text-sky-300 font-medium">procesamiento masivo ilimitado</span> y <span className="text-sky-300 font-medium">firmas Hash MD5/SHA-256</span>, revisa tus opciones de facturación.
                          </p>
                        </div>
                      </div>
                      
                      {/* BOTONES MEJORADOS DE GESTIÓN */}
                      <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <a 
                          href="mailto:evidenstalk@gmail.com?subject=Consulta%20sobre%20mi%20Suscripción" 
                          className="bg-[#0b1325] hover:bg-white/5 text-sky-100/80 font-semibold py-3 px-6 rounded-xl border border-white/10 transition-colors text-center flex-1"
                        >
                          Contactar Soporte
                        </a>

                        {/* Mostrar botón de cancelar SOLO si tiene un plan de pago y no es admin */}
                        {(planActual === 'pericial' || planActual === 'institucional') && !isAdmin && (
                          <button 
                            onClick={handleCancelSubscription}
                            disabled={isCancelling}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-3 px-6 rounded-xl border border-red-500/30 hover:border-red-500/50 transition-all text-center flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isCancelling ? 'Cancelando...' : 'Cancelar Suscripción'}
                          </button>
                        )}
                      </div>
                    </div>
                  </UserButton.UserProfilePage>
                  </UserButton>
                </div>
              </div>
            </SignedIn>
          </div>
          
        </div>
      </nav>

      {/* --- HERO SECTION Y RESTO DEL SITIO --- */}
      <section className="relative pt-40 pb-20 overflow-hidden flex flex-col items-center text-center px-4">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-sky-500/[0.08] rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto z-10 flex flex-col items-center">
          
          <motion.div variants={fadeUp} className="mb-8 relative group">
             <div className="absolute -inset-4 bg-sky-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
             <img 
               src="/logo.png"
               alt="Logo Grande" 
               className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[0_0_30px_rgba(14,165,233,0.3)] relative z-10"
             />
          </motion.div>

          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-xs font-semibold text-sky-400 mb-6 tracking-widest uppercase">
            Cyber Forensic Suite
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            <span className="text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">e</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-sky-100/50">
              VidensTalk
            </span>
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-sky-100/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Sistema integral para la gestión, análisis y preservación de evidencia digital. 
            Procesa chats exportados localmente con total seguridad y privacidad.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            
            {/* 🔥 NUEVO BOTÓN DE DESCARGA PARA WINDOWS 🔥 */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-sky-500 text-white border border-sky-500 px-6 py-3 rounded-lg font-bold hover:bg-sky-400 transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M6.555 1.375 0 2.237v5.45h6.555V1.375zM0 13.795l6.555.933V8.313H0v5.482zm7.278-5.4.026 6.378L16 16V8.395H7.278zM16 0 7.33 1.244v6.414H16V0z"/>
                  </svg>
                  Descargar para Windows
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <button onClick={handleDirectDownload} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-sky-500 text-white border border-sky-500 px-6 py-3 rounded-lg font-bold hover:bg-sky-400 transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M6.555 1.375 0 2.237v5.45h6.555V1.375zM0 13.795l6.555.933V8.313H0v5.482zm7.278-5.4.026 6.378L16 16V8.395H7.278zM16 0 7.33 1.244v6.414H16V0z"/>
                </svg>
                Descargar para Windows
              </button>
            </SignedIn>

            {/* BOTÓN DE GUÍA PERICIAL ORIGINAL */}
            <a href="/guia-procedimiento-pericial.pdf" target="_blank"
               className="w-full sm:w-auto flex items-center justify-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-6 py-3 rounded-lg font-medium hover:bg-sky-500/20 transition-colors">
              <FileText className="w-4 h-4" />
              Guía Pericial (PDF)
            </a>

          </motion.div>
        </motion.div>
      </section>

      <section id="how-it-works" className="py-24 border-t border-white/5 bg-[#0b1325] relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-xs font-bold text-sky-400 mb-6 uppercase tracking-widest">
              Flujo de Trabajo
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Evidencia lista en 3 pasos</h2>
            
            {/* SELECTOR ANIMADO DE FLUJO */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 bg-[#0f172a]/80 p-2 rounded-2xl border border-white/10 inline-flex backdrop-blur-sm shadow-xl relative z-20">
              <button 
                onClick={() => setFlujoActivo('comunidad')}
                className={`relative px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${flujoActivo === 'comunidad' ? 'text-slate-200 shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {flujoActivo === 'comunidad' && <motion.div layoutId="flujo-bg" className="absolute inset-0 bg-slate-600/30 border border-slate-500/50 rounded-xl -z-10" />}
                Comunidad
              </button>
              <button 
                onClick={() => setFlujoActivo('pericial')}
                className={`relative px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${flujoActivo === 'pericial' ? 'text-sky-300 shadow-[0_0_15px_rgba(14,165,233,0.3)]' : 'text-sky-600 hover:text-sky-400'}`}
              >
                {flujoActivo === 'pericial' && <motion.div layoutId="flujo-bg" className="absolute inset-0 bg-sky-500/20 border border-sky-500/50 rounded-xl -z-10" />}
                Pericial
              </button>
              <button 
                onClick={() => setFlujoActivo('institucional')}
                className={`relative px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${flujoActivo === 'institucional' ? 'text-indigo-300 shadow-md' : 'text-indigo-600 hover:text-indigo-400'}`}
              >
                {flujoActivo === 'institucional' && <motion.div layoutId="flujo-bg" className="absolute inset-0 bg-indigo-500/20 border border-indigo-500/50 rounded-xl -z-10" />}
                Institucional
              </button>
            </div>
            
            <p className="text-sky-100/60 max-w-2xl mx-auto mt-8 h-12">
              {flujoActivo === 'comunidad' && "Flujo simplificado para usuarios básicos y revisiones menores."}
              {flujoActivo === 'pericial' && "Procesa exportaciones de WhatsApp de forma 100% local garantizando la privacidad absoluta."}
              {flujoActivo === 'institucional' && "Flujo escalable para equipos de trabajo, peritajes masivos y auditorías."}
            </p>
          </div>

          <div className="relative min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={flujoActivo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-24"
              >
                {DATOS_FLUJO[flujoActivo].pasos.map((paso, index) => {
                  const isReverse = index % 2 !== 0;
                  const tema = DATOS_FLUJO[flujoActivo].tema;
                  
                  return (
                    <div key={index} className={`flex flex-col md:flex-row ${isReverse ? 'md:flex-row-reverse' : ''} items-center gap-12`}>
                      <div className="flex-1 space-y-6">
                        <div className={`w-12 h-12 rounded-full ${tema.bg} border ${tema.borde} flex items-center justify-center ${tema.texto} font-bold text-xl shadow-lg`}>
                          {index + 1}
                        </div>
                        <h3 className="text-2xl font-bold text-white">{paso.titulo}</h3>
                        <p className="text-sky-100/60 leading-relaxed">
                          {paso.desc}
                        </p>
                      </div>
                      
                      <div className="flex-1 w-full">
                        <div className="aspect-video rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl overflow-hidden relative group hover:border-white/20 transition-colors">
                          <div className={`absolute inset-0 bg-gradient-to-br ${tema.gradiente} to-transparent flex items-center justify-center`}>
                            <span className={`${tema.texto} font-medium flex flex-col items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-300`}>
                              {paso.icono}
                              {paso.imgText}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 border-t border-white/5 bg-[#070b14]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Garantías Forenses</h2>
            <p className="text-sky-100/60">Arquitectura diseñada específicamente para el rigor del ámbito legal y pericial.</p>
          </div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-sky-400" />} 
              title="Privacidad Absoluta (Offline)" 
              description="Procesamiento local y aislado. Tus archivos nunca pasan por servidores de terceros, asegurando intacta la cadena de custodia." 
            />
            <FeatureCard 
              icon={<CheckCircle2 className="w-6 h-6 text-sky-400" />} 
              title="Validez Jurídica (Hashes)" 
              description="Cálculo automático y estampado de firmas criptográficas (MD5 y SHA-256) para garantizar la inalterabilidad de la evidencia." 
            />
            <FeatureCard 
              icon={<Search className="w-6 h-6 text-sky-400" />} 
              title="Motor de Indexación Masiva" 
              description="Audita historiales de chat de varios años y gigabytes de peso sin bloqueos, con búsquedas globales en milisegundos." 
            />
          </motion.div>
        </div>
      </section>

      <section id="planes" className="py-24 border-t border-white/5 bg-[#070b14] relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Planes y Licencias</h2>
            <p className="text-sky-100/60 text-lg mb-8">Diseñado para adaptarse a las necesidades de cada investigación.</p>
            
            <div className="inline-flex bg-[#0f172a] border border-white/10 p-1.5 rounded-2xl relative z-20 shadow-lg mt-8">
              <button 
                onClick={() => setCicloFacturacion('mensual')}
                className={`relative px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${cicloFacturacion === 'mensual' ? 'text-white shadow-md' : 'text-sky-100/50 hover:text-white'}`}
              >
                {cicloFacturacion === 'mensual' && <motion.div layoutId="bg-pill" className="absolute inset-0 bg-sky-500 rounded-xl -z-10" />}
                <span className="relative z-10">Mensual</span>
              </button>
              <button 
                onClick={() => setCicloFacturacion('anual')}
                className={`relative px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${cicloFacturacion === 'anual' ? 'text-white shadow-md' : 'text-sky-100/50 hover:text-white'}`}
              >
                {cicloFacturacion === 'anual' && <motion.div layoutId="bg-pill" className="absolute inset-0 bg-sky-500 rounded-xl -z-10" />}
                <span className="relative z-10 flex items-center gap-2">Anual <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-widest text-white">-Ahorrá</span></span>
              </button>
            </div>
            
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch mt-4">
            
            {/* 1. PLAN COMUNIDAD */}
            <div className="rounded-2xl bg-[#0f172a] border border-white/10 p-8 flex flex-col h-full transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:border-white/20">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-baseline gap-2">
                Comunidad <span className="text-lg font-semibold text-sky-500">(Beta)</span>
              </h3>
              <p className="text-sky-100/50 mb-6 text-sm min-h-[48px]">Para estudiantes e investigaciones menores.</p>
              
              <div className="h-[60px] flex items-center mb-8">
                <span className="text-3xl font-bold text-white">Gratis</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1 text-sm">
                <li className="flex items-start gap-3 text-sky-100/80"><CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0" /> <span className="leading-tight">Procesamiento básico (hasta 15k msjs)</span></li>
                <li className="flex items-start gap-3 text-sky-100/80"><CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0" /> <span className="leading-tight">Búsqueda global de palabras clave</span></li>
                <li className="flex items-start gap-3 text-sky-100/80"><CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0" /> <span className="leading-tight">Exportación a PDF (Marca de agua)</span></li>
                <li className="flex items-start gap-3 text-white/30"><CheckCircle2 className="w-5 h-5 text-white/20 shrink-0" /> <span className="leading-tight">Sin cálculo de Hashes forenses</span></li>
                <li className="flex items-start gap-3 text-white/30"><CheckCircle2 className="w-5 h-5 text-white/20 shrink-0" /> <span className="leading-tight">Requiere conexión a internet</span></li>
              </ul>
              
              <div className="mt-auto pt-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="w-full py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">
                      Comenzar Gratis
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  {planActual === 'comunidad' ? (
                    <button 
                      onClick={handleDirectDownload}
                      className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" /> Descargar eVidensTalk
                    </button>
                  ) : (planActual === 'pericial' || planActual === 'institucional' || isAdmin) ? (
                    <button 
                      onClick={() => alert("Para bajar de plan o cancelar, gestiona tu facturación desde las opciones de tu cuenta.")}
                      className="group w-full py-3 rounded-xl border border-white/5 bg-white/5 transition-all hover:bg-red-500 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] text-center relative overflow-hidden"
                    >
                      <span className="block group-hover:hidden text-white/50 font-medium transition-opacity">Plan Básico</span>
                      <span className="hidden group-hover:block text-white font-bold transition-opacity">Bajar plan de licencia</span>
                    </button>
                  ) : (
                    <button disabled className="w-full py-3 rounded-xl border border-white/5 bg-white/5 text-white/50 font-medium cursor-not-allowed">
                      Cargando estado...
                    </button>
                  )}
                </SignedIn>
              </div>
            </div>
          
            {/* 2. PLAN PERICIAL */}
            <div className="rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#0a101f] border border-sky-500/50 p-8 flex flex-col relative shadow-[0_0_30px_rgba(14,165,233,0.15)] h-full transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_0_45px_rgba(14,165,233,0.3)] hover:border-sky-400">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                Recomendado para Peritos
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-baseline gap-2">
                Pericial <span className="text-lg font-semibold text-sky-400">(Beta)</span>
              </h3>
              <p className="text-sky-100/50 mb-6 text-sm min-h-[48px]">Rigor técnico y validez legal para presentaciones judiciales.</p>
              
              <div className="h-[60px] flex flex-col justify-center mb-8 relative">
                {descuentoPericial > 0 ? (
                  <>
                    <span className="text-sm text-sky-100/40 line-through font-medium absolute -top-1 tracking-wider">
                      ${PRECIOS.pericial[cicloFacturacion]}
                    </span>
                    <div className="text-3xl font-bold text-sky-400 flex items-center gap-2 mt-4">
                      ${calcularPrecioFinal(PRECIOS.pericial[cicloFacturacion], descuentoPericial)}
                      <span className="text-sm text-sky-100/50 font-normal">/ {cicloFacturacion === 'mensual' ? 'mes' : 'año'}</span>
                      <span className="bg-[#0f1f1a] border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ml-1">
                        {descuentoPericial}% OFF
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-3xl font-bold text-sky-400 flex items-center gap-2">
                    ${PRECIOS.pericial[cicloFacturacion]}
                    <span className="text-sm text-sky-100/50 font-normal">/ {cicloFacturacion === 'mensual' ? 'mes' : 'año'}</span>
                  </div>
                )}
              </div>
              
              <ul className="space-y-4 mb-8 flex-1 text-sm">
                <li className="flex items-start gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" /> <span className="leading-tight">Procesamiento masivo ilimitado</span></li>
                <li className="flex items-start gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" /> <span className="leading-tight">Hashes MD5 y SHA-256 automáticos</span></li>
                <li className="flex items-start gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" /> <span className="leading-tight">Reporte PDF Forense profesional</span></li>
                <li className="flex items-start gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" /> <span className="leading-tight">Privacidad Absoluta (Modo Offline)</span></li>
                <li className="flex items-start gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" /> <span className="leading-tight">Soporte técnico por correo</span></li>
              </ul>
              
              <div className="mt-auto pt-4">
                {!userId ? (
                  <button onClick={() => handleCheckout("pericial")} disabled={isCheckingOut} className="w-full py-3 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-400 transition-colors shadow-[0_0_20px_rgba(14,165,233,0.3)] mt-auto text-center flex justify-center items-center">
                    Iniciá sesión para comprar
                  </button>
                ) : (planActual === 'pericial' || isAdmin) ? (
                  <button onClick={handleDirectDownload} className="w-full py-3 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-400 transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)] flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" /> Descargar eVidensTalk
                  </button>
                ) : (planActual === 'institucional') ? (
                  <button 
                    onClick={() => alert("Para bajar de plan o cancelar, gestiona tu facturación desde las opciones de tu cuenta.")}
                    className="group w-full py-3 rounded-xl border border-sky-500/30 bg-sky-500/10 transition-all hover:bg-red-500 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] text-center relative overflow-hidden"
                  >
                    <span className="block group-hover:hidden text-sky-400/60 font-medium transition-opacity">Plan Inferior</span>
                    <span className="hidden group-hover:block text-white font-bold transition-opacity">Bajar plan de licencia</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => handleCheckout("pericial")} 
                    disabled={isCheckingOut}
                    className="w-full py-3 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-400 transition-colors shadow-[0_0_20px_rgba(14,165,233,0.3)] mt-auto text-center flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCheckingOut ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generando link...
                      </span>
                    ) : (
                      "Obtener Licencia"
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* 3. PLAN INSTITUCIONAL */}
            <div className="rounded-2xl bg-[#0f172a] border border-indigo-500/30 p-8 flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:border-indigo-500/50">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full"></div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-baseline gap-2">
                Institucional <span className="text-lg font-semibold text-indigo-400">(Beta)</span>
              </h3>
              <p className="text-sky-100/50 mb-6 text-sm min-h-[48px]">Para estudios jurídicos, agencias y fuerzas de seguridad.</p>
              
              <div className="h-[60px] flex flex-col justify-center mb-8 relative">
                {descuentoInstitucional > 0 ? (
                  <>
                    <span className="text-sm text-sky-100/40 line-through font-medium absolute -top-1 tracking-wider">
                      ${PRECIOS.institucional[cicloFacturacion]}
                    </span>
                    <div className="text-3xl font-bold text-indigo-400 flex items-center gap-2 mt-4">
                      ${calcularPrecioFinal(PRECIOS.institucional[cicloFacturacion], descuentoInstitucional)}
                      <span className="text-sm text-sky-100/50 font-normal">/ {cicloFacturacion === 'mensual' ? 'mes' : 'año'}</span>
                      <span className="bg-[#0f1f1a] border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ml-1">
                        {descuentoInstitucional}% OFF
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-3xl font-bold text-indigo-400 flex items-center gap-2">
                    ${PRECIOS.institucional[cicloFacturacion]}
                    <span className="text-sm text-sky-100/50 font-normal">/ {cicloFacturacion === 'mensual' ? 'mes' : 'año'}</span>
                  </div>
                )}
              </div>
              
              <ul className="space-y-4 mb-8 flex-1 text-sm">
                <li className="flex items-start gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> <span className="leading-tight">Todo lo de la Licencia Pericial</span></li>
                <li className="flex items-start gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> <span className="leading-tight"><span className="font-semibold">Marca Blanca:</span> Logo de tu institución en PDFs</span></li>
                <li className="flex items-start gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> <span className="leading-tight">Multi-licencia (Hasta 5 equipos)</span></li>
                <li className="flex items-start gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> <span className="leading-tight">Implementación y capacitación</span></li>
                <li className="flex items-start gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> <span className="leading-tight">Canal de soporte VIP directo</span></li>
              </ul>
              
              {!userId ? (
                <button onClick={() => handleCheckout("institucional")} disabled={isCheckingOut} className="w-full py-3 rounded-xl border border-indigo-500/50 text-indigo-300 font-medium hover:bg-indigo-500/10 transition-colors block text-center disabled:opacity-50">
                  Iniciá sesión para contratar
                </button>
              ) : (planActual === 'institucional' || isAdmin) ? (
                <button onClick={handleDirectDownload} className="w-full py-3 rounded-xl bg-indigo-500 text-white font-bold hover:bg-indigo-400 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> Descargar eVidensTalk
                </button>
              ) : (
                <button 
                  onClick={() => handleCheckout("institucional")}
                  disabled={isCheckingOut}
                  className="w-full py-3 rounded-xl border border-indigo-500/50 text-indigo-300 font-bold hover:bg-indigo-500/10 transition-colors block text-center disabled:opacity-50"
                >
                  {isCheckingOut ? "Procesando..." : "Contratar Plan Institucional"}
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      <section id="faq" className="py-24 border-t border-white/5 bg-[#0b1325]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-xs font-bold text-sky-400 mb-6 uppercase tracking-widest">
              Resolviendo Dudas
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Preguntas Frecuentes</h2>
            <p className="text-sky-100/60">Todo lo que necesitas saber sobre el funcionamiento y seguridad de eVidensTalk.</p>
          </div>

          <div className="space-y-4">
            <FAQItem 
              question="¿Mis chats se suben a alguna nube o servidor de internet?" 
              answer="Absolutamente no. eVidensTalk está diseñado bajo el principio de 'Privacidad por Diseño'. Todo el procesamiento, búsqueda y generación de reportes se realiza de forma 100% local en tu computadora. Tu evidencia nunca abandona tu disco duro." 
            />
            <FAQItem 
              question="¿Qué validez legal tienen los reportes generados?" 
              answer="Los reportes de la versión Pericial/Institucional incluyen el cálculo automático de firmas Hash (MD5 y SHA-256) del archivo original procesado. Esto garantiza el principio de inalterabilidad de la evidencia digital, requisito fundamental para presentarla en procesos judiciales o peritajes." 
            />
            <FAQItem 
              question="¿Necesito conexión a internet para usar el software?" 
              answer="El análisis de chats, búsquedas y generación de PDFs funciona de manera totalmente offline a través de nuestro archivo .exe. Solo se requiere conexión a internet para el inicio de sesión inicial (verificación de licencia) y para utilizar el motor de Inteligencia Artificial para las transcripciones de audios." 
            />
            <FAQItem 
              question="¿Qué formatos de chat soporta el sistema?" 
              answer="Actualmente eVidensTalk procesa las exportaciones estándar de WhatsApp. Solo necesitas exportar el chat desde el celular (usando la opción nativa 'Exportar chat' de WhatsApp) y cargar el archivo .txt o .zip resultante directamente en el programa." 
            />
            <FAQItem 
              question="¿Funciona en Mac (macOS) o Linux?" 
              answer="Por el momento, eVidensTalk está optimizado y empaquetado como un instalador nativo para Windows (.exe), ya que es el sistema operativo estándar en la gran mayoría de los laboratorios forenses, fuerzas de seguridad y estudios jurídicos." 
            />
          </div>
        </div>
      </section>

      <section id="soporte" className="py-24 border-t border-white/5 bg-[#070b14] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-xs font-bold text-sky-400 mb-6 uppercase tracking-widest">
            Centro de Ayuda
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">¿Necesitas asistencia técnica?</h2>
          <p className="text-sky-100/60 mb-10 text-lg">
            Nuestro equipo técnico está disponible para peritos, fuerzas de seguridad y organismos judiciales.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="mailto:evidenstalk@gmail.com?subject=Solicitud%20de%20Soporte%20Técnico%20-%20eVidensTalk&body=Hola%20equipo%20de%20eVidensTalk,%0A%0AMi%20nombre%20es:%20%0AInstitución/Estudio:%20%0A%0AMi%20consulta%20es%20la%20siguiente:%0A" 
               className="flex flex-col items-center p-8 rounded-2xl bg-[#0f172a] border border-white/5 hover:border-sky-500/40 transition-all group">
              <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-white font-bold mb-1">Contacto y Dudas</h3>
              <p className="text-sky-100/50 text-sm">Consultas generales sobre el software</p>
            </a>

            <a href="mailto:evidenstalk@gmail.com?subject=Reporte%20de%20Fallo/Bug%20-%20eVidensTalk&body=Hola,%20he%20encontrado%20un%20error%20en%20el%20programa.%0A%0ADescripción%20del%20problema:%0A%0APasos%20para%20reproducirlo:%0A%0AVersión%20de%20Windows:%0A" 
               className="flex flex-col items-center p-8 rounded-2xl bg-[#0f172a] border border-white/5 hover:border-red-500/40 transition-all group">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bug className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-white font-bold mb-1">Reportar un Error</h3>
              <p className="text-sky-100/50 text-sm">Ayúdanos a mejorar reportando fallos</p>
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-12 text-center text-sm text-sky-100/40 bg-[#070b14]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <p>© {new Date().getFullYear()} eVidensTalk - Cyber Forensic Suite. Desarrollado por <a href="https://portafolio-joa-tech.vercel.app/" target="_blank" className="text-sky-100/60 hover:text-sky-400 transition-colors font-medium">Joa Tech</a>.</p>
          
          <div className="flex items-center gap-8">
            <a href="/terminos" className="hover:text-sky-400 transition-colors underline underline-offset-8 decoration-white/10 hover:decoration-sky-400/50">
              Términos y Condiciones Legales
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-[#0f172a]/40 p-8 rounded-2xl flex flex-col gap-4 group hover:bg-[#0f172a]/80 transition-colors border border-white/5">
      <div className="w-12 h-12 rounded-full border border-sky-500/20 flex items-center justify-center bg-[#070b14] group-hover:scale-110 group-hover:border-sky-500/50 transition-all duration-300 shadow-[0_0_15px_rgba(14,165,233,0.1)]">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white tracking-tight">{title}</h3>
      <p className="text-sky-100/60 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/10 bg-[#0f172a]/50 rounded-xl overflow-hidden transition-colors hover:border-sky-500/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
      >
        <span className="font-semibold text-white pr-4 group-hover:text-sky-400 transition-colors">{question}</span>
        <ChevronDown className={`w-5 h-5 text-sky-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 text-sky-100/60 leading-relaxed text-sm">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}