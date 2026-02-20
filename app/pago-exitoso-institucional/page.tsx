"use client";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Mail } from "lucide-react";
import Link from "next/link";

export default function SuccessInstitucionalPage() {
  return (
    <div className="min-h-screen bg-[#0b1325] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-panel p-8 rounded-3xl border border-indigo-500/30 text-center"
      >
        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-10 h-10 text-indigo-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Bienvenido, Institución</h1>
        <p className="text-sky-100/60 mb-8">
          El pago del <strong>Plan Institucional</strong> ha sido procesado. Un asesor se pondrá en contacto para la configuración de las múltiples licencias y marca blanca.
        </p>

        <div className="space-y-4">
          <Link href="/" className="block w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all">
            Ir al Dashboard
          </Link>
          <div className="flex items-center justify-center gap-2 text-sm text-sky-100/40">
            <Mail className="w-4 h-4" />
            <span>Soporte VIP: evidenstalk@gmail.com</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}