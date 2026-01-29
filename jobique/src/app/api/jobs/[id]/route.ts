import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// POST /api/jobs[id] — update a job
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsedId = parseInt(id);
  const body = await req.json();

  try {
    // 1. Fetch existing job to check for old resume
    const existingJob = await prisma.jobApplication.findUnique({
      where: { id: parsedId, userId },
      select: { resumeUrl: true }
    });

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // 2. Handle S3 Cleanup if resume is removed or changed
    if (
      existingJob.resumeUrl &&
      (body.resumeUrl !== existingJob.resumeUrl || body.resumeUrl === "" || body.resumeUrl === null)
    ) {
      try {
        const bucketUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/`;
        if (existingJob.resumeUrl.startsWith(bucketUrl)) {
          const key = existingJob.resumeUrl.replace(bucketUrl, "");
          console.log(`Deleting old resume from S3: ${key}`);
          await s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: key,
          }));
        }
      } catch (s3Error) {
        console.error("Failed to delete old resume from S3:", s3Error);
      }
    }

    const updated = await prisma.jobApplication.update({
      where: { id: parsedId, userId },
      data: {
        title: body.title,
        company: body.company,
        location: body.location,
        pay: body.pay,
        h1bSponsor: body.h1bSponsor,
        link: body.link,
        status: body.status,
        applied_date: body.applied_date ? new Date(body.applied_date) : null,
        notes: body.notes,
        tags: body.tags,
        resources: body.resources,
        resumeUrl: body.resumeUrl, // Can be null/empty string
        // If resumeUrl is being set (truthy), update timestamp. If removed, keep as is or null?
        // Logic: If setting new resume -> update.
        ...(body.resumeUrl ? { resumeUpdatedAt: new Date() } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating job:", err);
    return NextResponse.json({ error: `Error updating job: ${(err as Error).message}` }, { status: 500 });
  }
}