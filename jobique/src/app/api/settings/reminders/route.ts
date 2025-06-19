import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET handler to return current reminderDays
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { reminderDays: true },
  });

  return NextResponse.json({ reminderDays: user?.reminderDays ?? 2 });
}

// PUT handler to update reminderDays
export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { reminderDays } = body;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { reminderDays },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating reminderDays:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}