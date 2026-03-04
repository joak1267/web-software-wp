"use client";

import { ArrowLeft, Gavel, ShieldCheck, Scale, AlertTriangle, Copyright, AlertOctagon, Cpu } from "lucide-react";

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
                De conformidad con la <strong>Ley 25.326</strong>, se informa que eVidensTalk no realiza recolección, almacenamiento ni tratamiento de datos personales en servidores propios o de terceros. El procesamiento se ejecuta de manera local y descentralizada en el hardware del usuario. El usuario asume el rol exclusivo de <strong>Responsable de Archivo/Base de Datos</strong>, eximiendo al desarrollador de cualquier deber de inscripción ante la Agencia de Acceso a la Información Pública.
              </p>
            </section>

            {/* CLAUSULA 2: DELITOS INFORMÁTICOS */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-sky-500" />
                <h2 className="text-xl font-bold text-white">2. Ley 26.388 y Acceso Legítimo</h2>
              </div>
              <p className="pl-8 leading-relaxed">
                El usuario declara bajo juramento que el uso de eVidensTalk se ajusta a derecho y no vulnera el <strong>Art. 153 bis del Código Penal Argentino</strong>. Queda terminantemente prohibido el uso de la herramienta para acceder, procesar o divulgar comunicaciones electrónicas sin la debida autorización del titular o mandato judicial expreso. El desarrollador no promueve ni facilita la interceptación ilegal de comunicaciones.
              </p>
            </section>

            {/* CLAUSULA 3: CADENA DE CUSTODIA */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-5 h-5 text-sky-500" />
                <h2 className="text-xl font-bold text-white">3. Cadena de Custodia y Valor Probatorio</h2>
              </div>
              <p className="pl-8 leading-relaxed">
                Se deja expresa constancia de que eVidensTalk es una herramienta de <strong>asistencia técnica y estructuración de datos</strong>. La preservación inalterable de la cadena de custodia y la extracción originaria de la evidencia digital recaen de forma exclusiva en el profesional actuante. El desarrollador no garantiza la admisibilidad procesal de los reportes generados, quedando sujeta a la libre valoración judicial.
              </p>
            </section>

            {/* 🔥 NUEVA CLAUSULA 4: PROPIEDAD INTELECTUAL 🔥 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Copyright className="w-5 h-5 text-sky-500" />
                <h2 className="text-xl font-bold text-white">4. Propiedad Intelectual (Ley 11.723)</h2>
              </div>
              <p className="pl-8 leading-relaxed">
                El software eVidensTalk, incluyendo su código fuente, algoritmos de indexación (FTS5), interfaz gráfica, logotipos y material documental, se encuentran protegidos por la <strong>Ley de Propiedad Intelectual N° 11.723</strong>. La adquisición de un plan otorga únicamente una <strong>licencia de uso limitada, no exclusiva y revocable</strong>. Queda estrictamente prohibida la ingeniería inversa, descompilación, reventa o alteración de los mecanismos de validación de licencias (HWID).
              </p>
            </section>

            {/* 🔥 NUEVA CLAUSULA 5: INTELIGENCIA ARTIFICIAL 🔥 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-5 h-5 text-sky-500" />
                <h2 className="text-xl font-bold text-white">5. Uso de Motores de Inteligencia Artificial</h2>
              </div>
              <p className="pl-8 leading-relaxed">
                Las funciones que integran procesamiento de Lenguaje Natural (ej. transcripción de notas de voz) operan mediante modelos de Inteligencia Artificial probabilísticos. El desarrollador no garantiza la exactitud milimétrica de las transcripciones. Es obligación irrenunciable del usuario <strong>auditar y cotejar la transcripción automatizada frente a la evidencia de audio original</strong> antes de incorporarla a un dictamen pericial definitivo.
              </p>
            </section>

            {/* 🔥 NUEVA CLAUSULA 6: LIMITACIÓN DE RESPONSABILIDAD 🔥 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <AlertOctagon className="w-5 h-5 text-sky-500" />
                <h2 className="text-xl font-bold text-white">6. Limitación de Responsabilidad (AS-IS)</h2>
              </div>
              <p className="pl-8 leading-relaxed">
                El software se proporciona <strong>"tal cual" (AS-IS)</strong>, sin garantías implícitas o explícitas de comerciabilidad o idoneidad para un fin específico. En ningún caso el desarrollador o sus afiliados serán responsables por daños directos, indirectos, lucro cesante, pérdida de datos, pérdida de honorarios o rechazo de demandas judiciales derivados del uso, incapacidad de uso o fallas temporales de la herramienta.
              </p>
            </section>

            <div className="bg-sky-500/5 border border-sky-500/10 p-6 rounded-xl text-sm italic mt-12">
              "El uso continuado de eVidensTalk y la creación de una cuenta en la plataforma implican la aceptación total e incondicional de los presentes términos. El presente documento constituye el acuerdo íntegro entre las partes. Cualquier controversia, divergencia o conflicto será sometido a la jurisdicción exclusiva de los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires, República Argentina."
            </div>
          </div>
        </div>
        
        <p className="mt-10 text-center text-xs text-sky-100/20 font-mono">
          EVIDENSTALK FORENSIC SUITE - VERSIÓN ACTUALIZADA {new Date().getFullYear()} - TODOS LOS DERECHOS RESERVADOS
        </p>
      </div>
    </div>
  );
}