import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // Basic validation to ensure it's a valid URL
        try {
            new URL(url);
        } catch {
            return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
        }

        console.log("Extracting job details from:", url);

        const res = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Referer": "https://www.google.com/",
            },
            cache: "no-store",
        });

        if (!res.ok) {
            console.error(`Fetch failed: ${res.status} ${res.statusText}`);
            if (res.status === 403 || res.status === 401) {
                return NextResponse.json({ error: "Access denied by the website (Anti-bot protection)" }, { status: 403 });
            }
            if (res.status === 404) {
                return NextResponse.json({ error: "Job page not found (404) - might be expired" }, { status: 404 });
            }
            return NextResponse.json(
                { error: `Failed to fetch URL: ${res.statusText}` },
                { status: res.status }
            );
        }
        const html = await res.text();
        const $ = cheerio.load(html);

        let title = "";
        let company = "";
        let location = "";
        let description = "";

        // 1. Try JSON-LD (Schema.org JobPosting) - Most reliable
        const jsonLdScripts = $('script[type="application/ld+json"]');
        jsonLdScripts.each((_, el) => {
            try {
                const text = $(el).html();
                if (text) {
                    const json = JSON.parse(text);
                    // Handle array of schemas or single object
                    const schemas = Array.isArray(json) ? json : [json];
                    const jobSchema = schemas.find(
                        (s) => s["@type"] === "JobPosting" || s["@type"] === "http://schema.org/JobPosting"
                    );

                    if (jobSchema) {
                        title = jobSchema.title || title;
                        company = jobSchema.hiringOrganization?.name || company;
                        location = jobSchema.jobLocation?.address?.addressLocality ||
                            (typeof jobSchema.jobLocation === 'string' ? jobSchema.jobLocation : "") ||
                            location;
                        description = jobSchema.description || description;
                    }
                }
            } catch (e) {
                console.warn("Failed to parse JSON-LD:", e);
            }
        });

        // 2. Fallback to Open Graph / Meta tags
        if (!title) {
            title = $('meta[property="og:title"]').attr("content") ||
                $('title').text().split("|")[0].trim() ||
                "";
        }
        if (!company) {
            company = $('meta[property="og:site_name"]').attr("content") ||
                $('meta[name="author"]').attr("content") ||
                "";
        }
        if (!description) {
            description = $('meta[property="og:description"]').attr("content") ||
                $('meta[name="description"]').attr("content") ||
                "";
        }

        return NextResponse.json({
            title,
            company,
            location,
            description,
        });
    } catch (error: any) {
        console.error("Extraction error:", error);
        return NextResponse.json({ error: "Failed to extract details" }, { status: 500 });
    }
}
