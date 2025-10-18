import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { id: postId, userId } = await req.json();
        console.log("postId = ", postId, "userId = ", userId);

        // 1️⃣ Check if like already exists
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: { userId, postId }, // ✅ uses @@unique([userId, postId]) from schema
            },
        });

        if (existingLike) {
            // 2️⃣ If already liked, remove it (unlike)
            const unlike = await prisma.like.delete({
                where: {
                    userId_postId: { userId, postId },
                },
            });
            return NextResponse.json({ status: "unliked", unlike });
        }

        // 3️⃣ Otherwise, create a new like
        const like = await prisma.like.create({
            data: {
                userId,
                postId,
            },
        });

        return NextResponse.json({ status: "liked", like });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, postId, userId } = await req.json();

        const like = await prisma.like.update({
            where: { id },
            data: {
                postId,
                userId,
            },
        });

        return NextResponse.json(like);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const postId = url.searchParams.get("id");

        if (!postId) {
            return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
        }

        const likes = await prisma.like.findMany({
            where: { postId },
        });

        return NextResponse.json(likes);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}