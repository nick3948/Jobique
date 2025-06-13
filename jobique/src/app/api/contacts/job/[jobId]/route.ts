import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobId = parseInt(params.jobId);

  const jobContacts = await prisma.jobContact.findMany({
    where: {
      jobId,
      job: { userId },
    },
    include: {
      contact: true,
    },
  });

  const contacts = jobContacts.map((jc) => jc.contact);
  console.log("Contacts for job", jobId, contacts);
  return NextResponse.json(contacts);
}