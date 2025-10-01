import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession, requireRole } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getAuthSession();
        await requireRole(session, ["admin", "writer"]);

        const posts = await prisma.post.findMany({
            include: { author: true },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ status: "success", posts });
    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 401 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();
        await requireRole(session, ["admin", "writer"]);

        const { title, content, tags, image, published } = await req.json();
        console.log('body', { title, content, tags, image, published })
        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                tags,
                image,
                published,
                slug: title.toLowerCase().replace(/\s+/g, "-"),
                authorId: session?.user?.id,
            },
        });

        return NextResponse.json({ status: "success", message: "Post created successfully", post: newPost });
    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 400 });
    }
}
