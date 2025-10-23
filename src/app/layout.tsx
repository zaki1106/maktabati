import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/layout/header';
import './globals.css';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Maktabati',
  description: 'Your personal library management system.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <AppProvider>
          <div className="fixed inset-0 w-full h-full -z-10">
            <Image
                src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Ksar_Melika.png"
                alt="Ksar Melika"
                layout="fill"
                objectFit="cover"
                quality={100}
            />
            <div className="absolute inset-0 w-full h-full bg-black/80" />
          </div>
          <div className="relative flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
