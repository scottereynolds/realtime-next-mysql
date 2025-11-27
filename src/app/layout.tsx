import type { Metadata } from "next";
import "./globals.css";
import { AuthSessionProvider } from "@/features/auth/components/AuthSessionProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QueryProvider } from "@/app/QueryProvider";
import { AppShell } from "@/features/layout/components/AppShell";
import { SnackbarProvider } from "@/contexts/SnackbarContext";
import { DialogProvider } from "@/contexts/DialogContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { RouteLoadingWatcher } from "@/components/Routing/RouteLoadingWatcher";

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
      <body className="bg-app text-app">
        <ThemeProvider>
          <LoadingProvider>
            <SnackbarProvider>
              <DialogProvider>
                <AuthSessionProvider>
                  <QueryProvider>
                    <AppShell>
                      <RouteLoadingWatcher />
                      {children}
                    </AppShell>
                  </QueryProvider>
                </AuthSessionProvider>
              </DialogProvider>
            </SnackbarProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
