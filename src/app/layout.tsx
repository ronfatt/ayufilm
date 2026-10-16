import type { Metadata } from 'next';
import './globals.css';
import { ProjectProvider } from '@/context/ProjectContext';

export const metadata: Metadata = {
  title: 'Ayu AiFilm Maker - Platform Pengeluaran Filem AI Profesional',
  description: 'Meja kerja pengeluaran profesional untuk syarikat filem dan pengarah AI, menghubungkan cerita, reka bentuk visual, tugasan, dan semakan tangkapan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="antialiased min-h-screen bg-graphite-950 text-graphite-200">
        <ProjectProvider>
          {children}
        </ProjectProvider>
      </body>
    </html>
  );
}
