⚡ Realtime Next.js + Prisma + MySQL + TanStack Query + WebSockets Starter

This project is a full-stack realtime application template powered by:

Next.js 16 (App Router, React 19)

Prisma ORM with MySQL

TanStack Query v5 for client-side data management

Socket.IO WebSockets for realtime updates

Material React Table (MRT) + MUI UI components

Tailwind CSS (preconfigured)

A full bootstrap script that generates a ready-to-run realtime project

The goal is to recreate the “automatic screen updates” effect familiar from Angular’s two-way binding — but using modern React + WebSockets + cache invalidation.

🚀 What the Project Generator Provides

Running create-realtime-next.sh automatically sets up:

A brand-new Next.js 16 / React 19 project

Tailwind CSS enabled

Prisma + MySQL + dotenv integration

A starter Message model with schema + migration

REST API routes for messages (/api/messages)

TanStack Query v5 with a global QueryProvider

A WebSocket server with Socket.IO (ws-server.js)

React hooks for reading/creating messages

A realtime Material React Table UI

Optional git repo initialization (local)

Once complete, you have a fully working realtime app where creating a message updates all open browser windows instantly.

🛠 Prerequisites

Before using the generator script:

Required

Node.js 18+

npm (or pnpm)

MySQL running locally (default: localhost:3306)

Bash (Git Bash on Windows works perfectly)

Optional (recommended)

Git (to initialize a repo and push to GitHub)

GitHub account (if you want to store your project remotely)

📦 Installing the Bootstrap Script

Place the script in any folder on your machine, for example:

C:\dev\scripts\create-realtime-next.sh (Windows)

~/dev/scripts/create-realtime-next.sh (macOS/Linux)

Make it executable (macOS/Linux/Git Bash):

chmod +x create-realtime-next.sh


On Windows from PowerShell, you can run it via Git Bash:

bash create-realtime-next.sh

🚧 Running the Script

From a terminal where create-realtime-next.sh lives:

./create-realtime-next.sh


You will be prompted for:

Project name → becomes the directory name

Database host → default: localhost

Database port → default: 3306

Username → default: root

Password → can be empty

Database name → defaults to project name

Initialize local git repository? → y/n

After that, the script will:

Create a new Next.js project with Tailwind

Set up Prisma + MySQL + dotenv

Generate a Message model and Prisma schema

Create REST endpoints at /api/messages

Add TanStack Query and a QueryProvider wrapper

Add useSocket and useMessages hooks

Create a simple page with:

A form to create messages

An MRT table to view them

Realtime updates via WebSocket broadcasting

Create ws-server.js and a ws npm script

Optionally initialize a git repository

🗄️ Apply Prisma Migrations

After the script finishes:

cd <project-name>
npx prisma migrate dev --name init_messages


This will:

Create the database (if it doesn’t exist)

Apply the Message schema

Generate the Prisma client

🛰 Starting the Servers

You’ll run two servers: WebSocket + Next.js.

1. Start the WebSocket server (port 4000)
npm run ws


You should see something like:

WebSocket server listening on http://localhost:4000


Leave this process running.

2. Start the Next.js dev server (port 3000)

In a second terminal:

npm run dev


Then open:

http://localhost:3000


Open the app in multiple browser windows or tabs.
When you submit a new message in one window, the others should update automatically in realtime.

🌐 Using Git + GitHub

If you chose to initialize a local git repo in the script, you’ll already have:

git init
git add .
git commit -m "Initial realtime Next.js + Prisma + TanStack + WebSockets setup"


To connect it to GitHub:

Create a new repository from the GitHub web UI (no README / .gitignore / license is safest).

Copy the repo URL (HTTPS is fine).

Run:

git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main


Your realtime starter is now backed up on GitHub.

📁 Project Structure

After generation, your project will look roughly like this:

<project-name>/
│
├── prisma/
│   ├── schema.prisma          # MySQL datasource + Message model
│   └── prisma.config.ts       # Loads dotenv + points to schema
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── messages/
│   │   │       └── route.ts   # GET/POST endpoints for messages
│   │   ├── QueryProvider.tsx  # TanStack Query v5 provider
│   │   ├── layout.tsx         # Wraps app with QueryProvider
│   │   └── page.tsx           # Form + MRT table + realtime updates
│   │
│   ├── hooks/
│   │   ├── useSocket.ts       # Socket.IO client hook
│   │   └── useMessages.ts     # TanStack Query hooks (list + create)
│   │
│   └── lib/
│       └── prisma.ts          # PrismaClient singleton
│
├── ws-server.js               # WebSocket server (CommonJS, no warnings)
├── global.d.ts                # Allows importing CSS files in TS
├── package.json
└── README.md

🎉 Ready for Realtime Development

This starter gives you a solid, modern foundation for:

Realtime dashboards

Live admin panels

Chat or messaging systems

Collaborative tools

Any UI that should update when data changes in MySQL

From here you can:

Add more Prisma models + tables

Scaffold additional API routes

Swap the simple message form/table for your own domain (users, apps, logs, etc.)

Integrate your Base component library and design system

Introduce auth, multi-tenancy, cron, background jobs, etc.
