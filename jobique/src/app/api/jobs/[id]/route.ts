import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseInt(params.id);
  const body = await req.json();

  try {
    const updated = await prisma.jobApplication.update({
      where: { id, userId },
      data: {
        title: body.title,
        company: body.company,
        location: body.location,
        pay: body.pay,
        h1bSponsor: body.h1bSponsor,
        link: body.link,
        status: body.status,
        applied_date: body.applied_date ? new Date(body.applied_date) : undefined,
        notes: body.notes,
        tags: body.tags,
        resources: body.resources,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating job:", err);
    return NextResponse.json({ error: "Error updating job" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseInt(params.id);

  try {
    await prisma.jobApplication.deleteMany({
      where: {
        id,
        userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting job:", err);
    return NextResponse.json({ error: "Error deleting job" }, { status: 500 });
  }
}