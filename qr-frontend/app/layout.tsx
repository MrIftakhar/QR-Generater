import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'QR Generater - Free Multi-Type QR Code Generator',
  description: 'Generate, manage, and track dynamic QR codes instantly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="d-flex flex-column min-vh-100 bg-light">
        <Navbar />
        <main className="grow d-flex flex-column">
          {children}
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}