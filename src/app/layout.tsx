import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rosa Maria · Atelier Botânico e Floricultura',
  description: 'Buquês, cestas e presentes com entrega em até 1 hora. Atendimento das 06:30 às 22:30.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
