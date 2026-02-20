import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { ClerkProvider } from '@clerk/nextjs';
// 1. Importamos el tema oscuro
import { dark } from '@clerk/themes';
import './globals.css';

// --- CONFIGURACIÓN SEO Y METADATOS ---
export const metadata: Metadata = {
  title: 'eVidensTalk | Cyber Forensic Suite para Evidencia Digital',
  description: 'Sistema integral para la gestión, análisis y preservación de evidencia digital. Organiza casos, busca palabras clave y genera reportes forenses de chats exportados.',
  keywords: 'evidencia digital, analisis forense, cyber forensic suite, transcripcion ia, reportes legales, chats, auditoria whatsapp',
  authors: [{ name: 'Joa Tech' }],
  icons: {
    icon: '/evidens.ico',
    shortcut: '/evidens.ico',
    apple: '/evidens.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 2. Agregamos la propiedad 'appearance' al ClerkProvider
    <ClerkProvider
      appearance={{
        // Usamos el tema oscuro como base
        baseTheme: dark,
        // Personalizamos los colores para que coincidan con tu marca (celeste)
        variables: {
          colorPrimary: '#38bdf8', // Este es el color "sky-400" de Tailwind que usas
          colorTextOnPrimaryBackground: 'white',
          // Opcional: si quieres que el fondo sea exactamente el mismo azul oscuro de tu web:
          // colorBackground: '#0f172a', 
        },
        // Opcional: Ajustes finos a los elementos
        elements: {
          card: 'border border-white/10 bg-[#0f172a]/90 backdrop-blur-md', // Bordes y fondo estilo "glass"
          headerTitle: 'text-white',
          headerSubtitle: 'text-sky-100/60',
          socialButtonsIconButton: 'border-white/10 hover:bg-white/5 transition-colors',
          formFieldInput: 'bg-[#070b14] border-white/10 focus:border-sky-500 transition-colors text-white',
          footerActionLink: 'text-sky-400 hover:text-sky-300',
        }
      }}
    >
      <html lang="es" className="scroll-smooth">
        <body>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}