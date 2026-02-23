"use client";

import { useState } from 'react';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';

export default function LicenseTab({ licencia }: { licencia: string }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Evitamos que copien el texto de error si no hay licencia
    if (licencia === 'LICENCIA-NO-ENCONTRADA') return;
    
    navigator.clipboard.writeText(licencia);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 font-sans">
      <h2 className="text-xl font-bold text-white mb-2">Licencia de Software</h2>
      <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
        Utiliza esta clave de seguridad para activar tu software de escritorio eVidensTalk Enterprise. Esta licencia es única e intransferible.
      </p>

      <div className="bg-[#0f1117] border border-neutral-800 p-5 rounded-xl w-full flex flex-col gap-5 shadow-sm">
        
        <div className="w-full">
          <p className="text-[11px] text-neutral-500 mb-2 uppercase tracking-widest font-semibold">
            Clave de Acceso (Serial)
          </p>
          {/* Contenedor con overflow-x-auto por si la clave es muy larga */}
          <div className={`font-mono text-lg sm:text-xl font-medium tracking-widest bg-black/60 py-3 px-4 rounded-lg border border-neutral-800/50 w-full overflow-x-auto whitespace-nowrap
            ${licencia === 'LICENCIA-NO-ENCONTRADA' ? 'text-red-400/80' : 'text-emerald-400'}`}>
            {show ? licencia : '••••••••••••••••'}
          </div>
        </div>
        
        <div className="flex flex-row items-center gap-3 w-full">
          <button 
            onClick={() => setShow(!show)}
            className="flex-1 py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 rounded-lg border border-neutral-700 transition-colors text-neutral-300 flex justify-center items-center gap-2 text-sm font-medium"
          >
            {show ? (
              <><EyeOff className="w-4 h-4" /> Ocultar</>
            ) : (
              <><Eye className="w-4 h-4" /> Mostrar</>
            )}
          </button>
          
          <button 
            onClick={handleCopy}
            disabled={licencia === 'LICENCIA-NO-ENCONTRADA'}
            className={`flex-1 py-2.5 px-4 rounded-lg transition-all font-semibold text-sm flex items-center justify-center gap-2 ${
              copied 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-sky-600 hover:bg-sky-500 text-white border border-transparent shadow-sm'
            } ${licencia === 'LICENCIA-NO-ENCONTRADA' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {copied ? (
              <><Check className="w-4 h-4" /> Copiado</>
            ) : (
              <><Copy className="w-4 h-4" /> Copiar Clave</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}