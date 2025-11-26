// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AuthSessionProvider } from "@/components/AuthSessionProvider";
import { QueryProvider } from "@/app/QueryProvider";

export const metadata: Metadata = {
  title: "Realtime Next + MySQL Starter",
  description: "Next 16 + Prisma + TanStack Query + WebSockets + Auth.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
