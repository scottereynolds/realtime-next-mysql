import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== "administrator") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const take = Number(searchParams.get("take") ?? "50");
  const skip = Number(searchParams.get("skip") ?? "0");
  const conversationIdParam = searchParams.get("conversationId");
  const senderId = searchParams.get("senderId");
  const q = searchParams.get("q");

  const where: any = {};

  if (conversationIdParam) {
    where.conversationId = Number(conversationIdParam);
  }

  if (senderId) {
    where.senderId = senderId;
  }

  if (q && q.trim()) {
    where.content = { contains: q.trim(), mode: "insensitive" };
  }

  const [items, total] = await Promise.all([
    prisma.message.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        sender: {
          select: { id: true, name: true, email: true, image: true },
        },
        conversation: {
          select: {
            id: true,
            type: true,
            title: true,
          },
        },
      },
    }),
    prisma.message.count({ where }),
  ]);

  return NextResponse.json(
    {
      items: items.map((m) => ({
        id: m.id,
        content: m.content,
        createdAt: m.createdAt,
        sender: m.sender,
        conversation: m.conversation,
      })),
      total,
      take,
      skip,
    },
    { status: 200 },
  );
}
