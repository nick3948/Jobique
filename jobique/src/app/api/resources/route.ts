import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json([], { status: 401 });

  const data = await prisma.resource.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const newResource = await prisma.resource.create({
    data: {
      userId,
      label: body.label,
      url: body.url,
      note: body.note,
    },
  });

  return NextResponse.json(newResource);
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ids } = await req.json();
  if (!Array.isArray(ids))
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  try {
    await prisma.resource.deleteMany({
      where: {
        id: { in: ids },
        userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { error: "Failed to delete resources" },
      { status: 500 }
    );
  }
}
