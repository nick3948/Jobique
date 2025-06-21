import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/nextjs/server";

// POST /api/jobs/share
export async function POST(req: NextRequest) {
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { recipient, jobIds } = await req.json();

  if (!recipient || !Array.isArray(jobIds)) {
    return NextResponse.json(
      { error: "Missing recipient or jobIds" },
      { status: 400 }
    );
  }

  let recipientUserId;
  let matchedUser;

  try {
    const usersResponse = await clerkClient.users.getUserList();
    const users = usersResponse.data;
    matchedUser = users.find(
      (user) =>
        user.emailAddresses.some((email) => email.emailAddress === recipient) ||
        user.username === recipient
    );
    recipientUserId = matchedUser?.id;
  } catch (error) {
    return NextResponse.json(
      { error: "Recipient lookup failed" },
      { status: 404 }
    );
  }

  if (!recipientUserId) {
    return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
  }

  const existing = await prisma.user.findUnique({
    where: { id: recipientUserId },
  });
  if (!existing) {
    await prisma.user.create({
      data: {
        id: recipientUserId,
        email: matchedUser?.emailAddresses[0]?.emailAddress || "",
        name: matchedUser?.firstName || "Shared User",
      },
    });
  }

  const jobsToShare = await prisma.jobApplication.findMany({
    where: {
      id: { in: jobIds },
      userId,
    },
  });

  const sharedJobs = await Promise.all(
    jobsToShare.map((job) =>
      prisma.jobApplication.create({
        data: {
          userId: recipientUserId,
          title: job.title,
          company: job.company,
          location: job.location,
          pay: job.pay,
          h1bSponsor: job.h1bSponsor,
          link: job.link,
          status: job.status,
          applied_date: job.applied_date,
          notes: job.notes,
          tags: job.tags,
          resources: job.resources,
          shared: true,
        },
      })
    )
  );

  // Send email notification to recipient
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const jobTitles = sharedJobs
    .map((job) => `- ${job.title} at ${job.company}`)
    .join("\n");

  const mailOptions = {
    from: `"Jobique" <${process.env.EMAIL_USER}>`,
    to: matchedUser?.emailAddresses[0]?.emailAddress,
    subject: "Job Applications Shared with You",
    text: `Hi ${matchedUser?.firstName || ""},\n\n${
      existing?.name || "A user"
    } has shared the following job applications with you via Jobique:\n\n${jobTitles}\n\nYou can now view them in your Jobique dashboard.\n\n- Team Jobique`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Failed to send share notification email", err);
  }

  return NextResponse.json({
    message: "Jobs shared successfully",
    count: sharedJobs.length,
  });
}
