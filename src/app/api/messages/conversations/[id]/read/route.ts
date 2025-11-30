// src/app/api/messages/conversations/[id]/read/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { broadcastMessageSeen } from "@/lib/messagesSocket";

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // ✅ Next 16: params is a Promise
    const { id } = await context.params;
    const conversationId = Number(id);

    if (!conversationId || Number.isNaN(conversationId)) {
      return NextResponse.json(
        { error: "Invalid conversation id" },
        { status: 400 },
      );
    }

    // Ensure this user is in the conversation
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    // 🔔 Update lastReadAt + broadcast message:seen + unread summary
    await broadcastMessageSeen(conversationId, userId);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("POST /api/messages/conversations/[id]/read error:", err);
    return NextResponse.json(
      { error: "Failed to mark conversation as read" },
      { status: 500 },
    );
  }
}
