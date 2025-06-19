import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/nextjs/server";

// POST /api/jobs — Add a new job
export async function POST(req: Request) {
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await clerkClient.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress || "";
  const name = user.firstName + " " + (user.lastName || "");
  const body = await req.json();

  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: email,
        name: name,
      },
    });
    const job = await prisma.jobApplication.create({
      data: {
        userId,
        title: body.title,
        company: body.company,
        location: body.location,
        pay: body.pay || "",
        h1bSponsor: body.h1bSponsor ?? false,
        link: body.link,
        status: body.status,
        applied_date: body.applied_date ? new Date(body.applied_date) : null,
        notes: body.notes || "",
        tags: body.tags || [],
        resources: body.resources || [],
        shared: body.shared ?? false,
      },
    });
    return NextResponse.json(job, { status: 201 });
  } catch (err) {
    console.error("Error creating job:", err);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}

// GET /api/jobs — Fetch jobs for signed-in user
export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const jobs = await prisma.jobApplication.findMany({
      where: { userId },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs — Bulk delete jobs
export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const ids: number[] = body.ids;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No job IDs provided" },
        { status: 400 }
      );
    }

    await prisma.jobApplication.deleteMany({
      where: {
        id: { in: ids },
        userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error bulk deleting jobs:", err);
    return NextResponse.json({ error: "Error deleting jobs" }, { status: 500 });
  }
}
