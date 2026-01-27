import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
    try {
        const { jobTitle, company, contactName, contactRole, userName, tone } = await req.json();

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "OpenAI API Key is missing. Please add it to your .env file." },
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
            model: "gpt-3.5-turbo",
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
