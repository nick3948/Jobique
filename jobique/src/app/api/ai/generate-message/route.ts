import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import OpenAI from "openai";

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const allowedUsers = process.env.ALLOWED_USERS?.split(",") || [];
        const userEmail = user.emailAddresses[0]?.emailAddress;

        if (allowedUsers.length > 0 && (!userEmail || !allowedUsers.includes(userEmail))) {
            return NextResponse.json(
                { message: "This feature is currently in private beta. Please contact the admin for access." },
                { status: 200 }
            );
        }

        const { jobTitle, company, contactName, contactRole, userName, tone } = await req.json();

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "AI agent not available currently. Please try again later." },
                { status: 500 }
            );
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const prompt = `Draft a ${tone || "professional"} LinkedIn message to ${contactName}${contactRole ? ` (${contactRole})` : ""
            } asking for a referral for the ${jobTitle} role at ${company}. The sender's name is ${userName}. Keep it concise, polite, and under 150 words. The message should express interest in the role and Company and kindly ask if they would be open to referring you or answering a few questions. Ensure the message is signed off with the sender's name: ${userName}.`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o-mini",
        });

        const message = completion.choices[0].message.content;

        return NextResponse.json({ message });
    } catch (error: any) {
        console.error("OpenAI generation error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate message" },
            { status: 500 }
        );
    }
}
