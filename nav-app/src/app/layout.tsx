// Root layout for the app
import './globals.css';
import { ReactNode } from 'react';
import { TRPCReactProvider } from '@/src/trpc/client';
import { Toaster } from '@/components/ui/sonner';
import { FaUserCircle } from 'react-icons/fa'; // Profile icon

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>
          <header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 20px',
              background: '#00853E',
              color: '#fff',
            }}
          >
            <nav style={{ display: 'flex', gap: '15px' }}>
              <a href="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</a>
              <a href="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</a>
              <a href="/signup" style={{ color: '#fff', textDecoration: 'none' }}>Signup</a>
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <a href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'inherit', textDecoration: 'none' }}>
                <span>Profile</span>
                <FaUserCircle size={24} />
              </a>
            </div>
          </header>
          <main style={{ padding: '20px' }}>{children}</main>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}

