import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET /api/contacts — get contacts, optionally filtered by jobId
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");
  const { userId } = await auth();
  if (!userId || !jobId) {
    return NextResponse.json([], { status: 200 });
  }

  const jobContacts = await prisma.jobContact.findMany({
    where: {
      jobId: parseInt(jobId),
      job: { userId },
    },
    include: {
      contact: true,
    },
  });

  const contacts = jobContacts.map((jc) => jc.contact);
  return NextResponse.json(contacts);
}

// POST /api/contacts — create new contact
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, email, company, linkedin, tags, notes, jobId } = body;

  try {
    // Check for duplicate contact for this job
    if (jobId) {
      const existingJobContact = await prisma.jobContact.findFirst({
        where: {
          jobId: parseInt(jobId),
          contact: {
            name,
            linkedin,
          },
        },
      });

      if (existingJobContact) {
        return NextResponse.json(
          { error: "Duplicate contact already exists for this job." },
          { status: 400 }
        );
      }
    }

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

    if (jobId) {
      await prisma.jobContact.create({
        data: {
          jobId: parseInt(jobId),
          contactId: newContact.id,
        },
      });
    }

    // Removed duplicate prisma.jobContact.create call

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
    // Delete associated jobContact links first
    await prisma.jobContact.deleteMany({
      where: {
        contactId: Number(id),
      },
    });

    // Then delete the contact
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