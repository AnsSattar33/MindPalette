// src/app/api/test-db/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET → fetch recent posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("❌ GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST → create a new post
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const post = await prisma.post.create({
      data: {
        title: body.title ?? "Untitled",
        slug: `test-${Date.now()}`,
        content: body.content ?? "",
        tags: body.tags ?? [],
        published: false,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("❌ POST error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
