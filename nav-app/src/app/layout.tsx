// Root layout for the app
import './globals.css';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: '10px', background: '#f0f0f0' }}>
          <nav>
            <a href="/" style={{ marginRight: '10px' }}>Home</a>
            <a href="/login" style={{ marginRight: '10px' }}>Login</a>
            <a href="/signup" style={{ marginRight: '10px' }}>Signup</a>
            <a href="/profile" style={{ marginRight: '10px' }}>Profile</a>
          </nav>
        </header>
        <main style={{ padding: '20px' }}>{children}</main>
      </body>
    </html>
  );
}
