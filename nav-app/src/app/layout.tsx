// Root layout for the app
import './globals.css';
import { ReactNode } from 'react';
import { TRPCReactProvider } from '@/src/trpc/client';
import { Toaster } from '@/components/ui/sonner';
import { FaUserCircle } from 'react-icons/fa'; // Profile icon
import NavBar from '@/src/features/customUI/components/nav-bar'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>
          <NavBar/>
          <main style={{ padding: '20px' }}>{children}</main>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}

