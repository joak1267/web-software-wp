"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Mail, Download, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="relative min-h-screen bg-[#050914] flex items-center justify-center p-4 font-sans overflow-hidden">
      
      {/* Brillo de fondo animado */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-xl w-full bg-[#0f172a]/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(52,211,153,0.1)]"
      >
        {/* --- Ícono de Éxito con efecto de Latido --- */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
          <div className="relative w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.5)]">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
        </div>
        
        {/* --- Título y Mensaje --- */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-4 tracking-tight">¡Pago Confirmado!</h1>
          <p className="text-sky-100/70 text-lg leading-relaxed">
            Gracias por confiar en <span className="text-sky-400 font-bold">eVidensTalk</span>. Tu transacción se ha procesado correctamente y tu licencia está asegurada.
          </p>
        </div>

        {/* --- Caja de Instrucciones (Próximos Pasos) --- */}
        <div className="bg-[#0b1325] border border-white/5 rounded-2xl p-6 mb-8 shadow-inner">
          <h3 className="text-xs font-bold text-sky-100/50 uppercase tracking-widest mb-6 text-center">
            Tus próximos pasos
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/20 shrink-0">
                <Mail className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">1. Revisa tu bandeja de entrada</h4>
                <p className="text-sm text-sky-100/60 leading-relaxed">
                  Te hemos enviado un correo con el recibo de tu compra y los detalles de tu nueva suscripción.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">2. Cuenta actualizada</h4>
                <p className="text-sm text-sky-100/60 leading-relaxed">
                  Tu usuario ya tiene asignados los permisos del Plan Pericial. Solo necesitas iniciar sesión en el programa para comenzar a procesar evidencias ilimitadas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Botones de Acción --- */}
        <div className="space-y-4">
          {/* Botón de descarga directa (usa el link que ya tenías en tu landing) */}
          <a 
            href="https://github.com/joak1267/evidenstalk-enterprise/releases/download/v1.2.0/eVidensTalk.Enterprise.Setup.1.2.0.exe" 
            className="flex items-center justify-center gap-3 w-full py-4 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] group"
          >
            <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            Descargar eVidensTalk v1.2.0
          </a>
          
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 w-full py-4 bg-[#0b1325] hover:bg-white/5 border border-white/10 text-sky-100/80 font-bold rounded-xl transition-all group"
          >
            Ir al Panel Principal
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* --- Footer / Soporte --- */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center justify-center gap-2 text-sm text-sky-100/40">
          <p>¿Tienes algún problema con tu activación?</p>
          <a href="mailto:evidenstalk@gmail.com" className="flex items-center gap-2 hover:text-sky-400 transition-colors font-medium">
            <Mail className="w-4 h-4" /> evidenstalk@gmail.com
          </a>
        </div>
        
      </motion.div>
    </div>
  );
}