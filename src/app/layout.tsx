import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import { CookieConsent } from "@/components/cookie-consent";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Indústria 360",
    template: "%s · Indústria 360",
  },
  description:
    "Portal de conteúdo e comunidade para profissionais de engenharia e indústria: cursos, artigos, aulas, materiais e notícias em um só lugar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${oswald.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
