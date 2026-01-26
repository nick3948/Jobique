// PUT /api/contacts/[id] — update a contact by ID
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsedId = parseInt(id);
  const body = await req.json();

  try {
    const updated = await prisma.contact.update({
      where: { id: parsedId, userId },
      data: {
        name: body.name,
        email: body.email,
        company: body.company,
        linkedin: body.linkedin,
        tags: body.tags,
        notes: body.notes,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating contact:", err);
    return NextResponse.json(
      { error: "Error updating contact" },
      { status: 500 }
    );
  }
}
