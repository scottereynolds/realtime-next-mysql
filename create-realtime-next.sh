#!/usr/bin/env bash
set -e

echo "=== Realtime Next.js + Prisma + TanStack + WebSockets bootstrap ==="

# 1. Ask for project name
read -rp "Project name (directory): " PROJECT_NAME
if [ -z "$PROJECT_NAME" ]; then
  echo "Project name is required."
  exit 1
fi

# 2. Ask for DB settings with defaults
read -rp "DB host [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -rp "DB port [3306]: " DB_PORT
DB_PORT=${DB_PORT:-3306}

read -rp "DB user [root]: " DB_USER
DB_USER=${DB_USER:-root}

# password can be empty; don't echo it
read -srp "DB password [empty]: " DB_PASS
echo

read -rp "DB name [${PROJECT_NAME}]: " DB_NAME
DB_NAME=${DB_NAME:-$PROJECT_NAME}

# Build DATABASE_URL (assumes no special chars in password, good enough for dev)
if [ -n "$DB_PASS" ]; then
  DATABASE_URL="mysql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
else
  DATABASE_URL="mysql://${DB_USER}:@${DB_HOST}:${DB_PORT}/${DB_NAME}"
fi

echo "Will use DATABASE_URL: ${DATABASE_URL}"
echo

# 3. Create Next.js app (TS, App Router, src, alias @/*, Tailwind enabled)
echo "=== Creating Next.js app '${PROJECT_NAME}' ==="
npx create-next-app@latest "$PROJECT_NAME" \
  --ts \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --eslint \
  --tailwind

cd "$PROJECT_NAME"

echo "=== Installing dependencies ==="
# Runtime deps
npm install \
  @prisma/client \
  @tanstack/react-query \
  @tanstack/react-query-devtools \
  material-react-table \
  @mui/material \
  @emotion/react \
  @emotion/styled \
  mysql2 \
  socket.io-client \
  socket.io

# Dev deps
npm install -D prisma dotenv

echo "=== Initializing Prisma ==="
npx prisma init

# 4. Write .env with DATABASE_URL (create or overwrite DATABASE_URL line)
if [ ! -f ".env" ]; then
  touch .env
fi

# Remove existing DATABASE_URL lines if any, then append
if grep -q "^DATABASE_URL=" .env; then
  sed -i.bak '/^DATABASE_URL=/d' .env
fi
echo "DATABASE_URL=\"${DATABASE_URL}\"" >> .env

# 5. Overwrite prisma/schema.prisma with MySQL + Message model
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Message {
  id        Int      @id @default(autoincrement())
  content   String
  author    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
EOF

# 6. Overwrite prisma.config.ts to load dotenv
cat > prisma.config.ts << 'EOF'
import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
});
EOF

echo "=== Generating Prisma client ==="
npx prisma generate

# 7. Add global.d.ts for CSS side-effect imports
cat > global.d.ts << 'EOF'
// Allow importing CSS files for side effects in TypeScript
declare module "*.css";
EOF

# 8. Make sure tsconfig.json includes **/*.d.ts
echo "=== Updating tsconfig.json to include *.d.ts ==="
node << 'EOF'
const fs = require('fs');

const path = 'tsconfig.json';
if (!fs.existsSync(path)) process.exit(0);

const raw = fs.readFileSync(path, 'utf8');
const cfg = JSON.parse(raw);

if (!Array.isArray(cfg.include)) {
  cfg.include = ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "**/*.d.ts"];
} else {
  if (!cfg.include.includes("**/*.d.ts")) {
    cfg.include.push("**/*.d.ts");
  }
}

fs.writeFileSync(path, JSON.stringify(cfg, null, 2));
EOF

# 9. Prisma helper
mkdir -p src/lib

cat > src/lib/prisma.ts << 'EOF'
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
EOF

# 10. QueryProvider for TanStack Query v5
cat > src/app/QueryProvider.tsx << 'EOF'
"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 30_000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
EOF

# 11. Wrap layout with QueryProvider (keep Tailwind globals)
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "./QueryProvider";

export const metadata: Metadata = {
  title: "Realtime Next + MySQL Demo",
  description: "React 19 + Prisma + TanStack Query + WebSockets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
EOF

# 12. WebSocket client hook
mkdir -p src/hooks

cat > src/hooks/useSocket.ts << 'EOF'
"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!socketInstance) {
      socketInstance = io("http://localhost:4000");
    }
    setSocket(socketInstance);

    return () => {
      // keep singleton alive for the app lifetime
    };
  }, []);

  return socket;
}
EOF

# 13. TanStack Query hooks for messages
cat > src/hooks/useMessages.ts << 'EOF'
"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Message } from "@prisma/client";

export function useMessages() {
  return useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      const res = await fetch("/api/messages");
      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }
      return res.json();
    },
  });
}

export function useCreateMessage(socket: any) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { content: string; author: string }) => {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to create message");
      }

      return res.json();
    },
    onSuccess: (createdMessage) => {
      // refresh our own list
      queryClient.invalidateQueries({ queryKey: ["messages"] });

      // notify other clients via WebSocket
      if (socket) {
        socket.emit("message:created", {
          id: createdMessage.id,
        });
      }
    },
  });
}
EOF

# 14. API route: /api/messages
mkdir -p src/app/api/messages

cat > src/app/api/messages/route.ts << 'EOF'
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { content, author } = body as { content: string; author: string };

  if (!content || !author) {
    return NextResponse.json(
      { error: "content and author are required" },
      { status: 400 }
    );
  }

  const message = await prisma.message.create({
    data: { content, author },
  });

  return NextResponse.json(message, { status: 201 });
}
EOF

# 15. Home page with MRT table (TanStack v5: isPending)
cat > src/app/page.tsx << 'EOF'
"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import type { Message } from "@prisma/client";
import { useMessages, useCreateMessage } from "@/hooks/useMessages";
import { useSocket } from "@/hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";

export default function HomePage() {
  const { data, isLoading, isError } = useMessages();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const createMessage = useCreateMessage(socket);

  const [author, setAuthor] = useState("Scott");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!socket) return;

    const handler = () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    };

    socket.on("message:created", handler);
    return () => {
      socket.off("message:created", handler);
    };
  }, [socket, queryClient]);

  const columns = useMemo<MRT_ColumnDef<Message>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 60,
      },
      {
        accessorKey: "author",
        header: "Author",
      },
      {
        accessorKey: "content",
        header: "Content",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        Cell: ({ cell }) =>
          new Date(cell.getValue<string>()).toLocaleString(),
      },
    ],
    []
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createMessage.mutate(
      { author: author || "Anonymous", content },
      {
        o
