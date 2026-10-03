import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import DynamicFooter from "@/components/DynamicFooter";
import { ChatWidget } from "@/components/chat";
import AuthContextProvider from '@/contexts/authContext';
export const metadata: Metadata = {
    title: "Biblioteca Especializada",
    description: "Biblioteca de la Facultad de Ciencias Físicas y Matemáticas - UNT",
};
export default function RootLayout({ children, }: Readonly<{
    children: React.ReactNode;
}>) {
    return (<html lang="es" suppressHydrationWarning>
      <body className="antialiased">
      <AuthContextProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Navbar />
          {children}
          <DynamicFooter />
          <ChatWidget />
        </ThemeProvider>
      </AuthContextProvider>
      </body>
    </html>);
}
