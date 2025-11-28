import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { auth } from "@/auth";

type AppRole = "user" | "administrator";

type UpdateUserBody = {
  name?: string;
  email?: string;
  role?: AppRole;
  password?: string;
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

function mapUser(user: any) {
  return {
    id: user.id as string,
    name: user.name ?? null,
    email: user.email ?? "",
    role: user.role as AppRole,
  };
}

// Optional GET
export async function GET(_req: Request, context: RouteContext) {
  await requireAdmin();

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json(
      { error: "User id is required." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json(mapUser(user));
}

export async function PUT(req: Request, context: RouteContext) {
  await requireAdmin();

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json(
      { error: "User id is required." },
      { status: 400 },
    );
  }

  let body: UpdateUserBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const updateData: any = {};

  if (typeof body.name !== "undefined") {
    updateData.name = body.name.trim() || null;
  }

  if (typeof body.email !== "undefined") {
    const email = body.email.trim();
    if (!email) {
      return NextResponse.json(
        { error: "Email cannot be empty." },
        { status: 400 },
      );
    }
    updateData.email = email;
  }

  if (typeof body.role !== "undefined") {
    const role = body.role;
    if (role !== "user" && role !== "administrator") {
      return NextResponse.json(
        { error: "Invalid role." },
        { status: 400 },
      );
    }
    updateData.role = role;
  }

  if (typeof body.password !== "undefined" && body.password) {
    updateData.passwordHash = await bcrypt.hash(body.password, 12);
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: "No fields to update." },
      { status: 400 },
    );
  }

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(mapUser(updated));
  } catch (err: any) {
    console.error("Failed to update user", err);

    if (err.code === "P2025") {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update user." },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  await requireAdmin();

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json(
      { error: "User id is required." },
      { status: 400 },
    );
  }

  // Figure out who is actually logged in (real admin, even if impersonating)
  const session = await auth();
  const realUserId =
    (session as any)?.realUserId ??
    (session as any)?.user?.realUserId ??
    (session as any)?.user?.id ??
    null;

  if (realUserId && String(realUserId) === String(id)) {
    return NextResponse.json(
      { error: "You cannot delete your own account." },
      { status: 400 },
    );
  }

  const target = await prisma.user.findUnique({
    where: { id },
  });

  if (!target) {
    return NextResponse.json(
      { error: "User not found." },
      { status: 404 },
    );
  }

  if (target.role === "administrator") {
    const adminCount = await prisma.user.count({
      where: { role: "administrator" },
    });

    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "You cannot delete the last administrator." },
        { status: 400 },
      );
    }
  }

  try {
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Failed to delete user", err);

    if (err.code === "P2025") {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Failed to delete user." },
      { status: 500 },
    );
  }
}
