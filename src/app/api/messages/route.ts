import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body || !body.content) {
    return NextResponse.json({ message: "Missing content" }, { status: 400 });
  }

  const author =
    body.author && body.author.trim().length > 0
      ? body.author
      : session.user.name || session.user.email;

  const created = await prisma.message.create({
    data: {
      content: body.content,
      author,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
