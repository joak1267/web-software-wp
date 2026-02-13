import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

// --- CONFIGURACIÓN SEO Y METADATOS ---
export const metadata: Metadata = {
  title: 'eVidensTalk | Cyber Forensic Suite para Evidencia Digital',
  description: 'Sistema integral para la gestión, análisis y preservación de evidencia digital. Organiza casos, busca palabras clave y genera reportes forenses de chats exportados.',
  keywords: 'evidencia digital, analisis forense, cyber forensic suite, transcripcion ia, reportes legales, chats, auditoria whatsapp',
  authors: [{ name: 'Joa Tech' }]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body>
        {/* Aquí se renderiza tu Landing Page */}
        {children}
        
        {/* El script de analíticas (Invisible para el usuario, visible en tu panel de Vercel) */}
        <Analytics />
      </body>
    </html>
  );
}