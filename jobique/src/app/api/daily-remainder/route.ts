import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const users = await prisma.user.findMany({
    include: { jobApplications: true },
  });

  const today = new Date();

  for (const user of users) {
    const reminderDays = user.reminderDays ?? 2;
    const jobsToRemind = user.jobApplications.filter((job) => {
      if (job.status !== "Saved") return false;
      if (!job.created_at) return false;
      const jobDate = new Date(job.created_at);
      const diff = Math.floor(
        (today.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diff >= reminderDays;
    });

    if (jobsToRemind.length > 0) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Jobique Reminder: You have ${jobsToRemind.length} saved jobs!`,
        text:
          `You have the following saved jobs for more than ${reminderDays} days:\n\n` +
          jobsToRemind
            .map(
              (j) =>
                `- ${j.title} at ${j.company} - <a href="${j.link}" target="_blank">Link</a>`
            )
            .join("\n"),
      });
    }
  }

  return NextResponse.json({ ok: true });
}
