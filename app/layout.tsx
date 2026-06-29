import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Providers from "./components/Providers";
import '@/app/globals.css'

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bridge Career Agent",
  description: "Phase 1 prototype for AI career skill gap reports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
