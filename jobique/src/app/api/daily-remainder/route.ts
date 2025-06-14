import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendReminderEmail } from "@/lib/mailer";

export async function GET() {
  const today = new Date();

  const users = await prisma.user.findMany({
    include: {
      jobApplications: true,
    },
  });

  for (const user of users) {
    for (const job of user.jobApplications) {
      const createdDate = new Date(job.created_at);
      const reminderSetting = user.reminderDays ?? 0;
      const diffInDays = Math.floor(
        (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffInDays === reminderSetting) {
        await sendReminderEmail(user.email, job);
      }
    }
  }

  return NextResponse.json({ status: "Reminder emails processed" });
}
