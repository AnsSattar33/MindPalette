import { NextResponse, NextRequest } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const likes = await prisma.like.findMany();
        return NextResponse.json(likes);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
