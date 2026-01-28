import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { filename, contentType, size } = await req.json();

        // 1. Validate size (5MB limit)
        if (size && size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
        }

        // 2. Check Daily Limit (20 uploads/day)
        let usage = await prisma.userUsage.findUnique({ where: { userId } });

        if (!usage) {
            usage = await prisma.userUsage.create({
                data: { userId, uploadCount: 0 }
            });
        }

        const today = new Date();
        const lastDate = new Date(usage.uploadDate);
        // Simple day check (local time of server, effectively)
        const isNewDay = today.toDateString() !== lastDate.toDateString();

        if (isNewDay) {
            // Reset for the new day
            usage = await prisma.userUsage.update({
                where: { userId },
                data: { uploadCount: 0, uploadDate: today }
            });
        }

        if (usage.uploadCount >= 20) {
            return NextResponse.json({
                error: "Daily upload limit reached (20/day). Please try again tomorrow."
            }, { status: 429 });
        }

        // 3. Generate Signed URL
        const uniqueFilename = `${userId}/${Date.now()}-${filename}`;

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: uniqueFilename,
            ContentType: contentType,
        });

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        // 4. Increment Count (Optimistic)
        await prisma.userUsage.update({
            where: { userId },
            data: { uploadCount: { increment: 1 } }
        });

        return NextResponse.json({
            signedUrl,
            fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${uniqueFilename}`
        });
    } catch (error) {
        console.error("S3 Presigned URL Error:", error);
        return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 });
    }
}
