import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@clerk/nextjs/server";

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

        const { fileUrl } = await req.json();

        // URL format: https://bucket.s3.amazonaws.com/userId/timestamp-filename
        const bucketUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/`;
        if (!fileUrl.startsWith(bucketUrl)) {
            return NextResponse.json({ signedUrl: fileUrl });
        }

        const key = fileUrl.replace(bucketUrl, "");

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: key,
        });

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return NextResponse.json({ signedUrl });
    } catch (error) {
        console.error("S3 Signed URL Error:", error);
        return NextResponse.json({ error: "Failed to create download URL" }, { status: 500 });
    }
}
