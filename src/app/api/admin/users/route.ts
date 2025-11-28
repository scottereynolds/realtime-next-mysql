import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

type AppRole = "user" | "administrator";

type CreateUserBody = {
  name?: string;
  email?: string;
  role?: AppRole;
  password?: string;
};

function mapUser(user: any) {
  return {
    id: user.id as string,
    name: user.name ?? null,
    email: user.email ?? "",
    role: user.role as AppRole,
    // no createdAt/updatedAt on your User model yet, so we omit them
  };
}

export async function GET() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { email: "asc" },
  });

  return NextResponse.json(users.map(mapUser));
}

export async function POST(req: Request) {
  await requireAdmin();

  let body: CreateUserBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const name = body.name?.trim() ?? null;
  const email = body.email?.trim() ?? "";
  const role = (body.role ?? "user") as AppRole;
  const password = body.password ?? "";

  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 },
    );
  }

  if (!password) {
    return NextResponse.json(
      { error: "Password is required." },
      { status: 400 },
    );
  }

  if (role !== "user" && role !== "administrator") {
    return NextResponse.json(
      { error: "Invalid role." },
      { status: 400 },
    );
  }

  // Ensure email is unique
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return NextResponse.json(
      { error: "A user with that email already exists." },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        passwordHash,
      },
    });

    return NextResponse.json(mapUser(user), { status: 201 });
  } catch (err) {
    console.error("Failed to create user", err);
    return NextResponse.json(
      { error: "Failed to create user." },
      { status: 500 },
    );
  }
}
