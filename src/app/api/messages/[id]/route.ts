import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust path if needed

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  // Next 16: params is a Promise – unwrap it first
  const { id: idParam } = await context.params;

  const id = Number(idParam);

  if (Number.isNaN(id)) {
    return NextResponse.json(
      { message: "Invalid message id" },
      { status: 400 },
    );
  }

  await prisma.message.delete({
    where: { id },
  });

  // 204 No Content – no body needed
  return new NextResponse(null, { status: 204 });
}
