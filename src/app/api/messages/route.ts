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
