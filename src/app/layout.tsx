import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { TempoInit } from "@/components/tempo-init";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tempo - Modern SaaS Starter",
  description: "A modern full-stack starter template powered by Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js"
          strategy="beforeInteractive"
        />
        <Script id="chunk-error-handler" strategy="beforeInteractive">
          {`
          window.addEventListener('error', function(event) {
            if (event.message && event.message.includes('ChunkLoadError')) {
              console.warn('Chunk load error detected, reloading page...');
              window.location.reload();
            }
          });
          
          window.addEventListener('unhandledrejection', function(event) {
            if (event.reason && event.reason.name === 'ChunkLoadError') {
              console.warn('Chunk load error detected, reloading page...');
              window.location.reload();
            }
          });
        `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <TempoInit />
      </body>
    </html>
  );
}
