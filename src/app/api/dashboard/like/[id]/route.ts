import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { postId, userId } = await req.json();

        const like = await prisma.like.create({
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