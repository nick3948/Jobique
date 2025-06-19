import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reminderDays } = await req.json();

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { reminderDays },
  });

  return NextResponse.json(updatedUser);
}