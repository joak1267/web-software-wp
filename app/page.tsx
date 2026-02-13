"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import emailjs from '@emailjs/browser';
import { 
  Github, 
  Download, 
  ShieldCheck, 
  FileText, 
  Lock, 
  CheckCircle2, 
  FolderOpen,
  Mic,
  X,
  BellRing
} from "lucide-react";

/// --- CONFIGURACIÓN DE ANIMACIONES ---
const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  // --- ESTADOS PARA LA VERSIÓN BETA (DESCARGA) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '' });

  // --- ESTADOS PARA LA VERSIÓN PRO (LISTA DE ESPERA) ---
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [proSubmitStatus, setProSubmitStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [proFormData, setProFormData] = useState({ name: '', email: '' });

  // --- LÓGICA DE DESCARGA BETA ---
  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');

    try {
      await emailjs.send(
        'service_82dhp4l',
        'template_sw19kez',
        {
          user_name: formData.name,
          user_email: formData.email,
          user_phone: "Descarga Beta",
          message: `¡NUEVO USUARIO! ${formData.name} ha descargado la versión Beta de eVidensTalk.`
        },
        'jeM9wPRA9hYUXfgAc'
      );

      setSubmitStatus('success');

      // Forzar descarga
      const link = document.createElement('a');
      link.href = 'https://github.com/joak1267/whatsapp-audit-tool/releases/download/v1.0.0/whatsapp-audit-tool.Setup.0.0.0.exe';
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitStatus('idle');
        setFormData({ name: '', email: '' });
      }, 2500);

    } catch (error) {
      console.error("Error al registrar lead Beta:", error);
      alert("Hubo un problema. Por favor, intenta de nuevo.");
      setSubmitStatus('idle');
    }
  };

  // --- LÓGICA DE LISTA DE ESPERA PRO ---
  const handleProWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProSubmitStatus('loading');

    try {
      await emailjs.send(
        'service_82dhp4l',
        'template_sw19kez',
        {
          user_name: proFormData.name,
          user_email: proFormData.email,
          user_phone: "Waitlist PRO",
          message: `💰 ¡NUEVO LEAD PRO! ${proFormData.name} se anotó a la lista de espera para comprar eVidensTalk Pro.`
        },
        'jeM9wPRA9hYUXfgAc'
      );

      setProSubmitStatus('success');

      setTimeout(() => {
        setIsProModalOpen(false);
        setProSubmitStatus('idle');
        setProFormData({ name: '', email: '' });
      }, 3000);

    } catch (error) {
      console.error("Error al registrar lead Pro:", error);
      alert("Hubo un problema de conexión. Por favor, intenta de nuevo.");
      setProSubmitStatus('idle');
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-white/30 font-sans">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full glass-panel z-50 border-b-0 border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-bold">
              eV
            </div>
            <span className="font-semibold tracking-tight text-white">eVidensTalk</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">Características</a>
            <a href="#pricing" className="hover:text-white transition-colors">Planes</a>
          </div>
          <a 
            href="https://github.com/joak1267/whatsapp-audit-tool.git" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium glass-panel px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-20 overflow-hidden flex flex-col items-center text-center px-4">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-white/[0.04] rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto z-10">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-xs font-medium text-neutral-300 mb-8 tracking-widest uppercase">
            Cyber Forensic Suite
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 mb-6">
            eVidensTalk v3.5
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Sistema integral para la gestión, análisis y preservación de evidencia digital. 
            Procesa chats exportados localmente con total seguridad y privacidad.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-neutral-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              Descargar Cliente (Windows)
            </button>
            <a 
              href="https://github.com/joak1267/whatsapp-audit-tool.git"
              target="_blank"
              className="w-full sm:w-auto flex items-center justify-center gap-2 glass-panel px-6 py-3 rounded-lg font-medium hover:bg-white/5 transition-colors"
            >
              <Github className="w-4 h-4" />
              Auditar Código
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-24 border-t border-white/5 bg-black/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Herramientas de Discovery</h2>
            <p className="text-neutral-400">Diseñado para peritos, abogados y analistas de seguridad.</p>
          </div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard icon={<FolderOpen className="w-6 h-6 text-white" />} title="Gestión de Casos" description="Crea carpetas contenedoras, organiza múltiples investigaciones en simultáneo y busca palabras clave a nivel global (Cross-Case)." />
            <FeatureCard icon={<Mic className="w-6 h-6 text-white" />} title="Transcripción IA" description="Conversión automática de notas de voz (OGG/Opus) a texto legible, directamente integrado en la visualización del chat." />
            <FeatureCard icon={<FileText className="w-6 h-6 text-white" />} title="Reportes y Entregables" description="Etiqueta mensajes clave como 'Evidencia' y genera reportes PDF profesionales listos para presentar." />
          </motion.div>
        </div>
      </section>

      {/* --- PLANES Y VERSIONES --- */}
      <section id="pricing" className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Nuestros Planes</h2>
            <p className="text-neutral-400">Elige la versión que mejor se adapte a tus necesidades de análisis forense.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* TARJETA 1: BETA (GRATIS) */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col h-full hover:-translate-y-2 transition-transform duration-300">
              <div className="mb-6 text-center">
                <h3 className="text-xl font-semibold text-white">Versión Beta</h3>
                <div className="mt-4 text-4xl font-bold text-white">$0 <span className="text-sm font-normal text-neutral-500 block mt-1">Acceso Temprano</span></div>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-neutral-300">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> Funciones esenciales habilitadas</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> Actualizaciones constantes</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> Acceso al canal de feedback</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> Soporte de la comunidad</li>
              </ul>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-white text-black py-3 rounded-lg font-bold hover:bg-neutral-200 transition-colors"
              >
                Descargar Gratis
              </button>
            </div>

            {/* TARJETA 2: PRO (DESTACADA Y VALIDADA) */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col h-full border border-indigo-500/50 shadow-[0_0_30px_rgba(79,70,229,0.15)] relative md:scale-105 z-10 bg-gradient-to-b from-indigo-500/10 to-transparent">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                En Desarrollo
              </div>
              <div className="mb-6 text-center mt-2">
                <h3 className="text-xl font-semibold text-white">Versión Pro</h3>
                <div className="mt-4 text-3xl font-bold text-indigo-400">Próximamente</div>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-neutral-300">
                <li className="flex items-start gap-3 text-white font-medium"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> Todo lo de la Beta, más:</li>
                <li className="flex items-start gap-3"><Lock className="w-5 h-5 text-neutral-500 shrink-0" /> Reportes forenses avanzados (Hash)</li>
                <li className="flex items-start gap-3"><Lock className="w-5 h-5 text-neutral-500 shrink-0" /> Exportación multiformato (PDF/Excel)</li>
                <li className="flex items-start gap-3"><Lock className="w-5 h-5 text-neutral-500 shrink-0" /> Marca de agua personalizada</li>
                <li className="flex items-start gap-3"><Lock className="w-5 h-5 text-neutral-500 shrink-0" /> Soporte prioritario por email</li>
              </ul>
              
              {/* BOTÓN MÁGICO DE VALIDACIÓN */}
              <button 
                onClick={() => setIsProModalOpen(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500 py-3 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2"
              >
                <BellRing className="w-4 h-4" /> Unirse a la lista de espera
              </button>
            </div>

            {/* TARJETA 3: ENTERPRISE */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col h-full hover:-translate-y-2 transition-transform duration-300 bg-gradient-to-b from-amber-500/5 to-transparent">
              <div className="mb-6 text-center">
                <h3 className="text-xl font-semibold text-white">Plan Enterprise</h3>
                <div className="mt-4 text-3xl font-bold text-amber-500/80">A Medida</div>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-neutral-300">
                <li className="flex items-start gap-3 text-white font-medium"><CheckCircle2 className="w-5 h-5 text-amber-500/80 shrink-0" /> Todo lo de la versión Pro, más:</li>
                <li className="flex items-start gap-3"><Lock className="w-5 h-5 text-neutral-500 shrink-0" /> Acceso a API local personalizada</li>
                <li className="flex items-start gap-3"><Lock className="w-5 h-5 text-neutral-500 shrink-0" /> Gestión de múltiples investigadores</li>
                <li className="flex items-start gap-3"><Lock className="w-5 h-5 text-neutral-500 shrink-0" /> Despliegue en servidores propios</li>
                <li className="flex items-start gap-3"><Lock className="w-5 h-5 text-neutral-500 shrink-0" /> Acuerdos SLA comerciales</li>
              </ul>
              <button className="w-full bg-transparent text-neutral-500 border border-white/10 py-3 rounded-lg font-bold cursor-not-allowed">
                Próximamente
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 py-8 text-center text-sm text-neutral-600">
        <p>© {new Date().getFullYear()} eVidensTalk - Cyber Forensic Suite. Desarrollado por <a href="https://github.com/joak1267" target="_blank" className="text-neutral-400 hover:text-white transition-colors">Joa Tech</a>.</p>
      </footer>

      {/* --- MODAL 1: DESCARGA BETA --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md glass-panel p-8 rounded-2xl bg-[#0f172a] border border-white/10 shadow-2xl"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
              
              <h3 className="text-2xl font-bold text-white mb-2">Acceso a la Beta</h3>
              <p className="text-neutral-400 text-sm mb-6">Ingresa tus datos para registrar tu acceso y comenzar la descarga segura.</p>
              
              <form onSubmit={handleDownloadSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Nombre completo</label>
                  <input 
                    type="text" required placeholder="Ej: Dr. Juan Pérez"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Correo electrónico profesional</label>
                  <input 
                    type="email" required placeholder="tu@estudio.com"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                
                <button 
                  type="submit" disabled={submitStatus !== 'idle'}
                  className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 mt-4
                    ${submitStatus === 'idle' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                    ${submitStatus === 'loading' ? 'bg-indigo-600/50 cursor-not-allowed' : ''}
                    ${submitStatus === 'success' ? 'bg-emerald-500' : ''}
                  `}
                >
                  {submitStatus === 'idle' && 'Descargar eVidensTalk Beta'}
                  {submitStatus === 'loading' && <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Procesando...</>}
                  {submitStatus === 'success' && <><CheckCircle2 className="w-5 h-5" /> ¡Descarga Iniciada!</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 2: LISTA DE ESPERA PRO --- */}
      <AnimatePresence>
        {isProModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsProModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md glass-panel p-8 rounded-2xl bg-[#0f172a] border border-indigo-500/30 shadow-[0_0_40px_rgba(79,70,229,0.2)]"
            >
              <button onClick={() => setIsProModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
              
              <div className="inline-block bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-500/30 mb-4">
                Beneficio Exclusivo
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Asegura un 50% OFF</h3>
              <p className="text-neutral-400 text-sm mb-6">La versión Pro con reportes forenses avanzados está en desarrollo. Únete a la lista para ser el primero en enterarte y obtener un descuento vitalicio.</p>
              
              <form onSubmit={handleProWaitlistSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Nombre completo</label>
                  <input 
                    type="text" required placeholder="Ej: Dra. María Gómez"
                    value={proFormData.name} onChange={(e) => setProFormData({...proFormData, name: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Correo electrónico para aviso</label>
                  <input 
                    type="email" required placeholder="tu@estudio.com"
                    value={proFormData.email} onChange={(e) => setProFormData({...proFormData, email: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                
                <button 
                  type="submit" disabled={proSubmitStatus !== 'idle'}
                  className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 mt-4
                    ${proSubmitStatus === 'idle' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : ''}
                    ${proSubmitStatus === 'loading' ? 'bg-indigo-600/50 cursor-not-allowed' : ''}
                    ${proSubmitStatus === 'success' ? 'bg-emerald-500' : ''}
                  `}
                >
                  {proSubmitStatus === 'idle' && 'Unirme a la lista de espera'}
                  {proSubmitStatus === 'loading' && <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Registrando...</>}
                  {proSubmitStatus === 'success' && <><CheckCircle2 className="w-5 h-5" /> ¡Estás en la lista!</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- SUB-COMPONENTES ---
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 group hover:bg-white/[0.04] transition-colors border border-white/5">
      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-black/50 group-hover:scale-110 transition-transform duration-300 shadow-lg">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white tracking-tight">{title}</h3>
      <p className="text-neutral-400 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}