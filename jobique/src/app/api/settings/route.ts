import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const days = parseInt(body.reminderDays);

  await prisma.user.update({
    where: { id: userId },
    data: { reminderDays: days },
  });

  return NextResponse.json({ success: true });
}