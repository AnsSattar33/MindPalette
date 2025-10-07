import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession, requireRole } from "@/lib/auth";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getAuthSession();
        await requireRole(session, ["admin", "writer"]);

        const { title, image, description, content, tags, published } = await req.json();
        const { id } = await context.params;
        const updated = await prisma.post.update({
            where: { id: id },
            data: { title, image, description, content, tags, published },
        });

        return NextResponse.json({ status: "success", message: "Post updated successfully", post: updated });
    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {

    try {
        const session = await getAuthSession();
        await requireRole(session, ["admin", "writer"]);
        const { id } = await context.params;
        await prisma.post.delete({ where: { id: id } });

        return NextResponse.json({ status: "success", message: "Post deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 400 });
    }
}