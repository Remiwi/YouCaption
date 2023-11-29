"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const qc = new QueryClient();

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={qc}>
      <html lang="en">
        <body className={inter.className}>
          <div>
            <Navbar />
            {children}
          </div>
        </body>
      </html>
    </QueryClientProvider>
  );
}
