"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react"; // Agrega esto si no lo tienes
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import emailjs from '@emailjs/browser';
import { 
  Bug,
  Mail, 
  Download, 
  ShieldCheck, 
  FileText, 
  Lock, 
  CheckCircle2, 
  FolderOpen,
  Mic,
  X,
  BellRing,
  Search,
  User,
  ChevronDown,
  Briefcase 
} from "lucide-react";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '' });

  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [proSubmitStatus, setProSubmitStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [proFormData, setProFormData] = useState({ name: '', email: '' });

 // --- LÓGICA DE DESCARGA ACTUALIZADA (v1.2.0) ---
  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    const baseUrl = window.location.origin;
    const pdfLink = `${baseUrl}/guia-procedimiento-pericial.pdf`;
    
    try {
      await emailjs.send(
        'service_82dhp4l', 
        'template_aydxraq',
        {
          user_name: formData.name, 
          user_email: formData.email,
          user_phone: "Descarga Enterprise v1.2", // Actualizado para seguimiento
          link_guia: pdfLink,
          message: `¡NUEVO USUARIO! ${formData.name} ha descargado eVidensTalk Enterprise v1.2.0.`
        },
        'jeM9wPRA9hYUXfgAc'
      );
      setSubmitStatus('success');
      
      // --- LINK DE DESCARGA DIRECTO AL GITHUB RELEASE v1.2.0 ---
      const link = document.createElement('a');
      link.href = 'https://github.com/joak1267/evidenstalk-enterprise/releases/download/v1.2.0/eVidensTalk.Enterprise.Setup.1.2.0.exe';
      link.download = ''; 
      document.body.appendChild(link); 
      link.click(); 
      document.body.removeChild(link);
      
      setTimeout(() => { setIsModalOpen(false); setSubmitStatus('idle'); setFormData({ name: '', email: '' }); }, 2500);
    } catch (error) {
      console.error(error); 
      alert("Hubo un problema. Por favor, intenta de nuevo."); 
      setSubmitStatus('idle');
    }
  };

  const handleProWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProSubmitStatus('loading');
    try {
      await emailjs.send(
        'service_82dhp4l', 'template_sw19kez',
        {
          user_name: proFormData.name, user_email: proFormData.email, user_phone: "Waitlist PRO",
          message: `💰 ¡NUEVO LEAD PRO! ${proFormData.name} se anotó a la lista de espera para comprar eVidensTalk Pro.`
        },
        'jeM9wPRA9hYUXfgAc'
      );
      setProSubmitStatus('success');
      setTimeout(() => { setIsProModalOpen(false); setProSubmitStatus('idle'); setProFormData({ name: '', email: '' }); }, 3000);
    } catch (error) {
      console.error(error); alert("Hubo un problema de conexión. Por favor, intenta de nuevo."); setProSubmitStatus('idle');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0b1325] selection:bg-sky-500/30 font-sans">
      
     {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full glass-panel z-50 border-b-0 border-white/5 bg-[#0b1325]/80 backdrop-blur-md">
        {/* 1. Agregamos 'relative' a este contenedor principal */}
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between relative">
          
          {/* IZQUIERDA: LOGO */}
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

          {/* CENTRO: ENLACES (Forzados al centro exacto) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-sm font-medium text-neutral-400">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-sky-400 transition-colors">
              Inicio
            </button>
            {/* Como Características está en medio de los 3, quedará justo en el centro de la pantalla */}
            <a href="#features" className="hover:text-sky-400 transition-colors">Características</a>
            <a href="#pricing" className="hover:text-sky-400 transition-colors">Planes</a>
          </div>

          {/* DERECHA: BOTONES DE LOGIN/PERFIL */}
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
                  />
                </div>
              </div>
            </SignedIn>
          </div>
          
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-20 overflow-hidden flex flex-col items-center text-center px-4">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-sky-500/[0.08] rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto z-10 flex flex-col items-center">
          
          {/* LOGO GRANDE EN HERO AGREGADO */}
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
          
          {/* Título actualizado a v1.2 */}
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
  {/* La "e" en celeste sólido */}
  <span className="text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">e</span>
  
  {/* El resto con el degradado original */}
  <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-sky-100/50">
    VidensTalk
  </span>
</motion.h1>
          
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-sky-100/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Sistema integral para la gestión, análisis y preservación de evidencia digital. 
            Procesa chats exportados localmente con total seguridad y privacidad.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <a href="/guia-procedimiento-pericial.pdf" target="_blank"
               className="w-full sm:w-auto flex items-center justify-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-6 py-3 rounded-lg font-medium hover:bg-sky-500/20 transition-colors">
              <FileText className="w-4 h-4" />
              Guía Pericial (PDF)
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* --- CÓMO FUNCIONA (CON IMÁGENES) --- */}
      <section id="how-it-works" className="py-24 border-t border-white/5 bg-[#0b1325] relative overflow-hidden">
        {/* Luz de fondo decorativa */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-xs font-bold text-sky-400 mb-6 uppercase tracking-widest">
              Flujo de Trabajo
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Evidencia lista en 3 pasos</h2>
            <p className="text-sky-100/60 max-w-2xl mx-auto">
              Procesa exportaciones de WhatsApp de forma 100% local. Sin subir datos a la nube, garantizando la privacidad absoluta.
            </p>
          </div>

          <div className="space-y-24">
            {/* PASO 1 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} 
              className="flex flex-col md:flex-row items-center gap-12"
            >
              <motion.div variants={fadeUp} className="flex-1 space-y-6">
                <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-xl">
                  1
                </div>
                <h3 className="text-2xl font-bold text-white">Exporta y Carga el Chat</h3>
                <p className="text-sky-100/60 leading-relaxed">
                  Solicita la exportación del chat de WhatsApp directamente desde el dispositivo móvil (formato .txt o .zip). Arrastra el archivo a eVidensTalk y el sistema lo estructurará automáticamente de forma cronológica, separando emisores y receptores.
                </p>
              </motion.div>
              <motion.div variants={fadeUp} className="flex-1 w-full">
                {/* CONTENEDOR DE IMAGEN */}
                <div className="aspect-video rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl overflow-hidden relative group">
                  {/* REEMPLAZAR ESTE DIV POR TU IMAGEN: <img src="/captura-1.png" alt="Cargar chat" className="w-full h-full object-cover" /> */}
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent flex items-center justify-center">
                    <span className="text-sky-100/30 font-medium flex flex-col items-center gap-2">
                      <Download className="w-8 h-8" />
                      [Imagen: Pantalla de carga de archivos]
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* PASO 2 (Invertido) */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} 
              className="flex flex-col md:flex-row-reverse items-center gap-12"
            >
              <motion.div variants={fadeUp} className="flex-1 space-y-6">
                <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-xl">
                  2
                </div>
                <h3 className="text-2xl font-bold text-white">Audita y Etiqueta</h3>
                <p className="text-sky-100/60 leading-relaxed">
                  Utiliza el motor de búsqueda global para encontrar palabras clave al instante. Escucha notas de voz integradas, transcribe audios largos y marca mensajes específicos con la etiqueta <span className="text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 text-sm">Evidencia</span> para incluirlos en el reporte final.
                </p>
              </motion.div>
              <motion.div variants={fadeUp} className="flex-1 w-full">
                {/* CONTENEDOR DE IMAGEN */}
                <div className="aspect-video rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl overflow-hidden relative group">
                  {/* REEMPLAZAR ESTE DIV POR TU IMAGEN */}
                  <div className="absolute inset-0 bg-gradient-to-bl from-sky-500/5 to-transparent flex items-center justify-center">
                    <span className="text-sky-100/30 font-medium flex flex-col items-center gap-2">
                      <Search className="w-8 h-8" />
                      [Imagen: Interfaz de búsqueda y etiquetado]
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* PASO 3 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} 
              className="flex flex-col md:flex-row items-center gap-12"
            >
              <motion.div variants={fadeUp} className="flex-1 space-y-6">
                <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-xl">
                  3
                </div>
                <h3 className="text-2xl font-bold text-white">Genera el Reporte Forense</h3>
                <p className="text-sky-100/60 leading-relaxed">
                  Exporta un documento PDF impecable listo para el juzgado. El reporte incluye automáticamente la fecha, hora, metadatos del archivo original y las firmas Hash (MD5/SHA256) para garantizar la inalterabilidad de la evidencia.
                </p>
              </motion.div>
              <motion.div variants={fadeUp} className="flex-1 w-full">
                {/* CONTENEDOR DE IMAGEN */}
                <div className="aspect-video rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl overflow-hidden relative group">
                  {/* REEMPLAZAR ESTE DIV POR TU IMAGEN */}
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent flex items-center justify-center">
                    <span className="text-sky-100/30 font-medium flex flex-col items-center gap-2">
                      <FileText className="w-8 h-8" />
                      [Imagen: Vista previa del PDF con Hash]
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- BENEFICIOS TÉCNICOS (Antiguo Features) --- */}
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

     {/* --- SECCIÓN DE PLANES / PRICING --- */}
      <section id="planes" className="py-24 border-t border-white/5 bg-[#070b14] relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Planes y Licencias</h2>
            <p className="text-sky-100/60 text-lg">Diseñado para adaptarse a las necesidades de cada investigación.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            
            {/* 1. PLAN COMUNIDAD */}
            <div className="rounded-2xl bg-[#0f172a] border border-white/10 p-8 flex flex-col h-full transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:border-white/20">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-baseline gap-2">
                Edición Comunidad <span className="text-lg font-semibold text-sky-500">(Beta)</span>
              </h3>
              <p className="text-sky-100/50 mb-6 text-sm">Para estudiantes e investigaciones menores.</p>
              <div className="text-3xl font-bold text-white mb-8">Gratis</div>
              
              <ul className="space-y-4 mb-8 flex-1 text-sm">
                <li className="flex items-start gap-3 text-sky-100/80"><Check className="w-5 h-5 text-sky-500 shrink-0" /> Procesamiento básico (hasta 15k msjs)</li>
                <li className="flex items-start gap-3 text-sky-100/80"><Check className="w-5 h-5 text-sky-500 shrink-0" /> Búsqueda global de palabras clave</li>
                <li className="flex items-start gap-3 text-sky-100/80"><Check className="w-5 h-5 text-sky-500 shrink-0" /> Exportación a PDF (Marca de agua)</li>
                <li className="flex items-start gap-3 text-white/30"><Check className="w-5 h-5 text-white/20 shrink-0" /> Sin cálculo de Hashes forenses</li>
                <li className="flex items-start gap-3 text-white/30"><Check className="w-5 h-5 text-white/20 shrink-0" /> Requiere conexión a internet</li>
              </ul>
              <button className="w-full py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors mt-auto">
                Comenzar Gratis
              </button>
            </div>
          
            {/* 2. PLAN PERICIAL (Destacado - El más vendido) */}
            <div className="rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#0a101f] border border-sky-500/50 p-8 flex flex-col relative shadow-[0_0_30px_rgba(14,165,233,0.15)] h-full transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_0_45px_rgba(14,165,233,0.3)] hover:border-sky-400">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                Recomendado para Peritos
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-baseline gap-2">
                Licencia Pericial <span className="text-lg font-semibold text-sky-400">(Beta)</span>
              </h3>
              <p className="text-sky-100/50 mb-6 text-sm">Rigor técnico y validez legal para presentaciones judiciales.</p>
              <div className="text-3xl font-bold text-sky-400 mb-8">Consultar</div>
              
              <ul className="space-y-4 mb-8 flex-1 text-sm">
                <li className="flex items-start gap-3 text-white"><Check className="w-5 h-5 text-sky-400 shrink-0" /> Procesamiento masivo ilimitado</li>
                <li className="flex items-start gap-3 text-white"><Check className="w-5 h-5 text-sky-400 shrink-0" /> Hashes MD5 y SHA-256 automáticos</li>
                <li className="flex items-start gap-3 text-white"><Check className="w-5 h-5 text-sky-400 shrink-0" /> Reporte PDF Forense profesional</li>
                <li className="flex items-start gap-3 text-white"><Check className="w-5 h-5 text-sky-400 shrink-0" /> Privacidad Absoluta (Modo Offline)</li>
                <li className="flex items-start gap-3 text-white"><Check className="w-5 h-5 text-sky-400 shrink-0" /> Soporte técnico por correo</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-400 transition-colors shadow-[0_0_20px_rgba(14,165,233,0.3)] mt-auto">
                Solicitar Licencia
              </button>
            </div>

            {/* 3. PLAN INSTITUCIONAL (El "Premium") */}
            <div className="rounded-2xl bg-[#0f172a] border border-indigo-500/30 p-8 flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:border-indigo-500/50">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full"></div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-baseline gap-2">
                Institucional <span className="text-lg font-semibold text-indigo-400">(Beta)</span>
              </h3>
              <p className="text-sky-100/50 mb-6 text-sm">Para estudios jurídicos, agencias y fuerzas de seguridad.</p>
              <div className="text-3xl font-bold text-indigo-400 mb-8">A Medida</div>
              
              <ul className="space-y-4 mb-8 flex-1 text-sm">
                <li className="flex items-start gap-3 text-white"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> Todo lo de la Licencia Pericial</li>
                <li className="flex items-start gap-3 text-white"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> <span className="font-semibold">Marca Blanca:</span> Logo de tu institución en PDFs</li>
                <li className="flex items-start gap-3 text-white"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> Multi-licencia (Hasta 5 equipos)</li>
                <li className="flex items-start gap-3 text-white"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> Implementación y capacitación</li>
                <li className="flex items-start gap-3 text-white"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> Canal de soporte VIP directo</li>
              </ul>
              <button className="w-full py-3 rounded-xl border border-indigo-500/50 text-indigo-300 font-medium hover:bg-indigo-500/10 transition-colors mt-auto">
                Contactar Ventas
              </button>
            </div>

          </div>
        </div>
      </section>


      {/* --- PREGUNTAS FRECUENTES (FAQ) --- */}
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
              answer="Los reportes de la versión Enterprise/Pro incluyen el cálculo automático de firmas Hash (MD5 y SHA-256) del archivo original procesado. Esto garantiza el principio de inalterabilidad de la evidencia digital, requisito fundamental para presentarla en procesos judiciales o peritajes." 
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

      {/* --- SECCIÓN DE SOPORTE --- */}
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
            
            {/* BOTÓN 1: SOPORTE GENERAL */}
            <a href="mailto:evidenstalk@gmail.com?subject=Solicitud%20de%20Soporte%20Técnico%20-%20eVidensTalk&body=Hola%20equipo%20de%20eVidensTalk,%0A%0AMi%20nombre%20es:%20%0AInstitución/Estudio:%20%0A%0AMi%20consulta%20es%20la%20siguiente:%0A" 
               className="flex flex-col items-center p-8 rounded-2xl bg-[#0f172a] border border-white/5 hover:border-sky-500/40 transition-all group">
              <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-white font-bold mb-1">Contacto y Dudas</h3>
              <p className="text-sky-100/50 text-sm">Consultas generales sobre el software</p>
            </a>

            {/* BOTÓN 2: REPORTAR BUG */}
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

      
      {/* --- FOOTER --- */}
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

      {/* --- MODAL DE DESCARGA (Enterprise) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-[#0b1325]/90 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md p-8 rounded-2xl bg-[#0f172a] border border-white/10 shadow-2xl"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-sky-100/50 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-bold text-white mb-2">Descargar Enterprise</h3>
              <p className="text-sky-100/60 text-sm mb-6">Versión 1.2.0 (Windows). Ingresa tus datos para registrar la licencia.</p>
              
              <form onSubmit={handleDownloadSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sky-100/80 mb-1">Nombre completo</label>
                  <input type="text" required placeholder="Ej: Dr. Juan Pérez" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#070b14] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-sky-100/30 focus:outline-none focus:border-sky-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sky-100/80 mb-1">Correo electrónico profesional</label>
                  <input type="email" required placeholder="tu@estudio.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[#070b14] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-sky-100/30 focus:outline-none focus:border-sky-500 transition-colors" />
                </div>
                <button type="submit" disabled={submitStatus !== 'idle'}
                  className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 mt-4
                    ${submitStatus === 'idle' ? 'bg-sky-500 hover:bg-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.3)]' : ''}
                    ${submitStatus === 'loading' ? 'bg-sky-500/50 cursor-not-allowed' : ''}
                    ${submitStatus === 'success' ? 'bg-emerald-500' : ''} `}>
                  {submitStatus === 'idle' && 'Iniciar Descarga'}
                  {submitStatus === 'loading' && 'Procesando...'}
                  {submitStatus === 'success' && <><CheckCircle2 className="w-5 h-5" /> ¡Descarga Iniciada!</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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

// --- NUEVO COMPONENTE FAQ ITEM ---
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