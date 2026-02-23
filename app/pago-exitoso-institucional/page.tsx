"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Mail, ArrowRight, Building2, UserCog, Phone } from "lucide-react";
import Link from "next/link";

export default function SuccessInstitucionalPage() {
  return (
    <div className="relative min-h-screen bg-[#050914] flex items-center justify-center p-4 font-sans overflow-hidden">
      
      {/* Brillo de fondo animado (Tono Índigo para Institucional) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-xl w-full bg-[#0f172a]/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.15)]"
      >
        {/* --- Ícono VIP con efecto de Latido --- */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping" />
          <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)] border border-indigo-400/50">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
        </div>
        
        {/* --- Título y Mensaje --- */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-black uppercase tracking-widest mb-4">
            Licencia Corporativa Activa
          </div>
          <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Bienvenido, Institución</h1>
          <p className="text-sky-100/70 text-lg leading-relaxed">
            Tu pago ha sido procesado con éxito. Gracias por elegir <span className="text-indigo-400 font-bold">eVidensTalk</span> para respaldar las investigaciones de tu organización.
          </p>
        </div>

        {/* --- Caja de Instrucciones VIP --- */}
        <div className="bg-[#0b1325] border border-white/5 rounded-2xl p-6 mb-8 shadow-inner relative overflow-hidden">
          {/* Detalle decorativo lateral */}
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600 opacity-50"></div>

          <h3 className="text-xs font-bold text-sky-100/50 uppercase tracking-widest mb-6 text-center">
            Protocolo de Integración
          </h3>
          
          <div className="space-y-6 pl-2">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
                <UserCog className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">1. Asignación de Ejecutivo</h4>
                <p className="text-sm text-sky-100/60 leading-relaxed">
                  Un asesor técnico VIP se pondrá en contacto contigo en las próximas horas para coordinar la configuración de tus múltiples licencias.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
                <Building2 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">2. Diseño Marca Blanca</h4>
                <p className="text-sm text-sky-100/60 leading-relaxed">
                  Te solicitaremos el logotipo y los datos de tu estudio/agencia para compilar la versión personalizada de eVidensTalk que estampará tus reportes PDF.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Botones de Acción --- */}
        <div className="space-y-4">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-3 w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] group"
          >
            Ir al Dashboard Principal
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* --- Footer / Soporte VIP con WhatsApp --- */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center justify-center gap-2 text-sm text-sky-100/40">
          <p>Línea directa de WhatsApp para clientes institucionales:</p>
          <a 
            href="https://wa.me/5491124673417?text=Hola,%20acabo%20de%20adquirir%20el%20Plan%20Institucional%20de%20eVidensTalk%20y%20me%20gustaría%20coordinar%20la%20configuración." 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-bold tracking-wide mt-1"
          >
            <Phone className="w-4 h-4" /> Contactar Soporte VIP
          </a>
        </div>
        
      </motion.div>
    </div>
  );
}