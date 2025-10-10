import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        // 🛑 Check prompt
        if (!prompt) {
            return NextResponse.json({ error: "No prompt provided." }, { status: 400 });
        }

        console.log("Prompt:", prompt);

        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "openai/gpt-oss-20b", // ✅ Free Groq model
                messages: [
                    {
                        role: "system",
                        content: `
                                You are an AI content generator for a blogging platform.
                                Your job is to create engaging and SEO-friendly blog content.

                                Generate the following based on the user's topic:
                                1. A catchy and SEO-friendly title
                                2. A short description (max 160 characters)
                                3. A full article in HTML format (headings, paragraphs, and bullet points suitable for RichTextEditor)
                                4. 5-10 relevant tags for SEO

                                Return ONLY valid JSON (no markdown, no code blocks). 
                                Format exactly like this:
                                {
                                "title": "...",
                                "description": "...",
                                "content": "...",
                                "tags": ["tag1", "tag2", "tag3"]
                                }
                            `,
                    },
                    {
                        role: "user",
                        content: `Topic: ${prompt}`,
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        let text = response.data?.choices?.[0]?.message?.content || "";

        // 🧹 Remove markdown if model adds it
        text = text.replace(/```json|```/g, "").trim();

        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch (e) {
            console.warn("⚠️ Failed to parse JSON, returning raw text instead.");
            parsed = { raw: text };
        }

        return NextResponse.json({
            title: parsed.title || "",
            description: parsed.description || "",
            content: parsed.content || parsed.raw || "",
            tags: parsed.tags || [],
        });
    } catch (error: any) {
        console.error("Groq API Error:", error.response?.data || error.message);
        return NextResponse.json(
            {
                error: "Groq API Error",
                details: error.response?.data || error.message,
            },
            { status: 500 }
        );
    }
}
