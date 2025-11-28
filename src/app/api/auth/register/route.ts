import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body ?? {};

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

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

    // Build the data object separately, then cast for Prisma.
    const data: any = {
      name: name ?? null,
      email,
      // This field exists in your schema at runtime, even if
      // the generated TS types haven't picked it up yet.
      passwordHash,
      // role defaults to `user` via Prisma
    };

    const user = await prisma.user.create({ data });

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Registration error", err);
    return NextResponse.json(
      { error: "Unexpected error while registering." },
      { status: 500 },
    );
  }
}
