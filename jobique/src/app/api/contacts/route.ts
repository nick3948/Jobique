import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET /api/contacts — get all contacts of current user
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const contacts = await prisma.contact.findMany({
    where: { userId },
    include: { jobContacts: true },
    orderBy: { created_at: "desc" },
  });

  return NextResponse.json(contacts);
}

// POST /api/contacts — create new contact
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, email, company, linkedin, tags, notes } = body;

  try {
    const newContact = await prisma.contact.create({
      data: {
        userId,
        name,
        email,
        company,
        linkedin,
        tags,
        notes,
      },
    });

    return NextResponse.json(newContact);
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}

// DELETE /api/contacts — delete contact by ID
export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing contact ID" }, { status: 400 });
  }

  try {
    await prisma.contact.delete({
      where: {
        id: Number(id),
        userId,
      },
    });

    return NextResponse.json({ message: "Contact deleted" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
  }
}