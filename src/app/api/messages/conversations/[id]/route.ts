import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// If you have a server-side auth helper, you can wire it in here.
// For example (commented out so this compiles without guessing paths):
//
// import { auth } from "@/auth"; // or your actual helper
//
// then inside GET:
// const session = await auth();
// if (!session?.user?.id) { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // ✅ Next 16: params is a Promise, must be awaited
    const { id } = await context.params;

    const conversationId = Number(id);
    if (!conversationId || Number.isNaN(conversationId)) {
      return NextResponse.json(
        { error: "Invalid conversation id" },
        { status: 400 },
      );
    }

    // Optional: once you wire auth back in, you can enforce membership like this:
    //
    // const session = await auth();
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    //
    // const participant = await prisma.conversationParticipant.findFirst({
    //   where: { conversationId, userId: session.user.id },
    // });
    // if (!participant) {
    //   return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    // }

    // Parse ?take=50
    const { searchParams } = new URL(req.url);
    const takeParam = searchParams.get("take");
    let take = 50;

    if (takeParam) {
      const parsed = parseInt(takeParam, 10);
      if (!Number.isNaN(parsed) && parsed > 0) {
        take = Math.min(parsed, 200); // simple cap
      }
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      take,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        messages: messages.map((m) => ({
          id: m.id,
          content: m.content,
          createdAt: m.createdAt,
          sender: m.sender
            ? {
                id: m.sender.id,
                name: m.sender.name,
                image: m.sender.image,
              }
            : null,
        })),
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("GET /api/messages/conversations/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to load messages" },
      { status: 500 },
    );
  }
}
