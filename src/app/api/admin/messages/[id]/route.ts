import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session?.user || session.user.role !== "administrator") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const messageId = Number(id);

  if (!messageId || Number.isNaN(messageId)) {
    return NextResponse.json(
      { error: "Invalid message id" },
      { status: 400 },
    );
  }

  // Option: soft delete by setting deletedAt instead of actual delete
  await prisma.message.delete({
    where: { id: messageId },
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
