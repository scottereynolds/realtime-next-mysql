import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  id: string;
};

export async function DELETE(
  req: Request,
  context: { params: Promise<RouteParams> },
) {
  const { id } = await context.params;

  const numericId = Number(id);

  if (!Number.isInteger(numericId)) {
    return NextResponse.json(
      { error: "Invalid message id" },
      { status: 400 },
    );
  }

  try {
    await prisma.message.delete({
      where: { id: numericId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting message", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 },
    );
  }
}
