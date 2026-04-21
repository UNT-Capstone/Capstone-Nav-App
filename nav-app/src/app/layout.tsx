// Root layout for the app
import './globals.css';
import { ReactNode } from 'react';
import { TRPCReactProvider } from '@/src/trpc/client';
import { Toaster } from '@/components/ui/sonner';
import GlassNavbar from '@/src/features/customUI/components/GlassNav';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 m-0 p-0">
        <TRPCReactProvider>
          <GlassNavbar />
         
          <main className="w-screen min-h-screen pt-28">{children}</main>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}