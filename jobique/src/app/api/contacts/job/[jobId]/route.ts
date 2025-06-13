import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ jobId: string }> }
) {
    const { jobId } = await context.params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobIdNumber = parseInt(jobId);

  const jobContacts = await prisma.jobContact.findMany({
    where: {
      jobId: jobIdNumber,
      job: { userId },
    },
    include: {
      contact: true,
    },
  });

  const contacts = jobContacts.map((jc) => jc.contact);
  console.log("Contacts for job", jobIdNumber, contacts);
  return NextResponse.json(contacts);
}