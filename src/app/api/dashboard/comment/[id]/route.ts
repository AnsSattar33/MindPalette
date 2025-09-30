import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession, requireRole } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getAuthSession();
        await requireRole(session, ["admin"]);

        const { action } = await req.json(); // "approve" | "hide"

        const updated = await prisma.comment.update({
            where: { id: params.id },
            data: { content: action === "hide" ? "[hidden]" : undefined },
        });

        return NextResponse.json({ status: "success", message: "Comment updated", comment: updated });
    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 400 });
    }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getAuthSession();
        await requireRole(session, ["admin"]);

        await prisma.comment.delete({ where: { id: params.id } });

        return NextResponse.json({ status: "success", message: "Comment deleted" });
    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 400 });
    }
}
