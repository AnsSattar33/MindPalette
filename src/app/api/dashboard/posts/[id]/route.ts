import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession, requireRole } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getAuthSession();
        await requireRole(session, ["admin", "writer"]);

        const { title, image, description, content, tags, published } = await req.json();

        const updated = await prisma.post.update({
            where: { id: params.id },
            data: { title, image, description, content, tags, published },
        });

        return NextResponse.json({ status: "success", message: "Post updated successfully", post: updated });
    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 400 });
    }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getAuthSession();
        await requireRole(session, ["admin", "writer"]);

        await prisma.post.delete({ where: { id: params.id } });

        return NextResponse.json({ status: "success", message: "Post deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 400 });
    }
}
