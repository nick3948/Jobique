import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function GET(req: Request) {
    try {
        const fourMonthsAgo = new Date();
        fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

        const oldJobs = await prisma.jobApplication.findMany({
            where: {
                OR: [
                    {
                        resumeUpdatedAt: { lt: fourMonthsAgo },
                    },
                    {
                        resumeUpdatedAt: null,
                        created_at: { lt: fourMonthsAgo },
                    }
                ],
                resumeUrl: { not: null }
            },
            take: 100
        });

        if (oldJobs.length === 0) {
            return NextResponse.json({ message: "No old files to clean up." });
        }

        const deletedIds: number[] = [];
        const errors: any[] = [];

        for (const job of oldJobs) {
            if (!job.resumeUrl) continue;

            try {
                const bucketUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/`;
                const key = job.resumeUrl.replace(bucketUrl, "");
                await s3Client.send(new DeleteObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME!,
                    Key: key,
                }));

                deletedIds.push(job.id);
            } catch (e) {
                console.error(`Failed to delete S3 file for job ${job.id}:`, e);
                errors.push({ id: job.id, error: String(e) });
            }
        }

        if (deletedIds.length > 0) {
            await prisma.jobApplication.updateMany({
                where: { id: { in: deletedIds } },
                data: { resumeUrl: null, resumeUpdatedAt: null }
            });
        }

        return NextResponse.json({
            message: "Cleanup complete",
            processed: oldJobs.length,
            deleted: deletedIds.length,
            errors
        });

    } catch (error) {
        console.error("Cleanup Error:", error);
        return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
    }
}
