import nodemailer from "nodemailer";

export async function sendReminderEmail(email: string, job: any) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Jobique Reminder" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Reminder to apply for ${job.title} at ${job.company}`,
    text: `You've set a reminder to apply for the job "${job.title}" at ${job.company}. Click the job link to apply:\n\n${job.link}`,
  });
}