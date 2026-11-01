import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SesionProvider } from "@/components/sesion-provider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "MesaTech Cloud",
  description: "Mesa de ayuda para solicitudes de soporte tecnológico",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-CL" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SesionProvider>{children}</SesionProvider>
      </body>
    </html>
  );
}
