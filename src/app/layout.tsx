import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "./QueryProvider";

export const metadata: Metadata = {
  title: "Realtime Next + MySQL Demo",
  description: "React 19 + Prisma + TanStack + WebSockets demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
