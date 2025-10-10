import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {

        const { id, userId } = await req.json();
        console.log("postId = ", id, "userId = ", userId)

        const existing = await prisma.post.findUnique({
            where: { id } // composite unique index
        });
        console.log("checkLikedOrNot = ", existing)
        if (!existing) {
            const unlike = await prisma.like.deleteMany({
                where: {
                    postId: id,
                    userId,
                },
            });
            return NextResponse.json(unlike);
        }

        const like = await prisma.like.create({
            data: {
                postId: id,
                userId,
            },
        });

        await prisma.post.update({
            where: { id, userId },
            data: {
                Like: {
                    create: {
                        id,
                        userId: userId
                    }
                }
            }
        });

        return NextResponse.json(like);
    } catch (error: any) {
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