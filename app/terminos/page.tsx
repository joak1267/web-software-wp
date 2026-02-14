"use client";

import { ArrowLeft, Gavel, ShieldCheck, Scale, AlertTriangle } from "lucide-react";

export default function TerminosLegalesAR() {
  return (
    <div className="min-h-screen bg-[#0b1325] text-sky-100/80 font-sans py-20 px-4 selection:bg-sky-500/30">
      <div className="max-w-4xl mx-auto">
        
        <a href="/" className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors mb-8 font-medium group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Volver al Portal
        </a>

        <div className="bg-[#0f172a] border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl relative">
          
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10 border-b border-white/5 pb-10">
            <div className="w-16 h-16 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.1)]">
              <Gavel className="w-8 h-8 text-sky-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Términos, Condiciones y Marco Legal</h1>
              <p className="text-sky-100/40 mt-1 uppercase tracking-widest text-xs font-bold">Jurisdicción: República Argentina</p>
            </div>
          </div>

          <div className="space-y-12">
            
            {/* CLAUSULA 1: DATOS PERSONALES */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-sky-500" />
                <h2 className="text-xl font-bold text-white">1. Ley 25.326 de Protección de Datos Personales</h2>
              </div>
              <p className="pl-8 leading-relaxed">
                De conformidad con la <strong>Ley 25.326</strong>, se informa que eVidensTalk no realiza recolección, almacenamiento ni tratamiento de datos personales en servidores propios o de terceros. El procesamiento se ejecuta de manera local y descentralizada. El usuario asume el rol de <strong>Responsable de Archivo/Base de Datos</strong>, eximiendo al desarrollador de cualquier deber de inscripción ante la Agencia de Acceso a la Información Pública.
              </p>
            </section>

            {/* CLAUSULA 2: DELITOS INFORMÁTICOS */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-sky-500" />
                <h2 className="text-xl font-bold text-white">2. Ley 26.388 y Acceso Legítimo</h2>
              </div>
              <p className="pl-8 leading-relaxed">
                El usuario declara que el uso de eVidensTalk se ajusta a derecho y no vulnera el <strong>Art. 153 bis del Código Penal Argentino</strong>. Queda prohibido el uso de la herramienta para acceder a comunicaciones electrónicas sin la debida autorización del titular o mandato judicial. El desarrollador no promueve ni facilita el "hacking" o la interceptación ilegal de comunicaciones.
              </p>
            </section>

            {/* CLAUSULA 3: CADENA DE CUSTODIA */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-5 h-5 text-sky-500" />
                <h2 className="text-xl font-bold text-white">3. Cadena de Custodia y Valor Probatorio</h2>
              </div>
              <p className="pl-8 leading-relaxed">
                Se deja constancia de que eVidensTalk es una herramienta de <strong>asistencia técnica forense</strong>. La preservación de la cadena de custodia y la integridad de la prueba digital recae exclusivamente en el perito o profesional actuante. El desarrollador no garantiza la admisibilidad del reporte en procesos judiciales, la cual quedará sujeta a la valoración de los magistrados bajo las reglas de la sana crítica.
              </p>
            </section>

            <div className="bg-sky-500/5 border border-sky-500/10 p-6 rounded-xl text-sm italic">
              "El presente documento constituye el acuerdo total entre las partes. Cualquier controversia será sometida a la jurisdicción de los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires."
            </div>
          </div>
        </div>
        
        <p className="mt-10 text-center text-xs text-sky-100/20">
          eVidensTalk v3.5 - Software Forense Local - {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}