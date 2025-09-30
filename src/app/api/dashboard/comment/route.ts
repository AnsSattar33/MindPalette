import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession, requireRole } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getAuthSession();
        await requireRole(session, ["admin"]);

        const comments = await prisma.comment.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ status: "success", comments });
    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 401 });
    }
}
