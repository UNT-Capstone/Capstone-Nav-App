// Root layout for the app
import './globals.css';
import { ReactNode } from 'react';
import { TRPCReactProvider } from '@/src/trpc/client';
import { Toaster } from '@/components/ui/sonner';
import GlassNavbar from '@/src/features/customUI/components/GlassNav';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <TRPCReactProvider>
          {/* Use the new unified glass navbar here */}
          <GlassNavbar />
          <main>{children}</main>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}