import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextResponse, context: { params: Promise<{ id: string }> }) {

    try {
        // const { searchParams } = new URL(req.url)
        // console.log("searchParams = ", searchParams)
        // const id = searchParams.get("id")
        const { id } = await context.params
        console.log("id in comment get = ", id)

        if (!id) {
            return NextResponse.json({ error: "Post id is required" }, { status: 400 })
        }

        const comments = await prisma.comment.findMany({
            where: {
                postId: id,
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        return NextResponse.json({ status: "success", comments })
    } catch (error) {
        return NextResponse.json({ status: "error", message: error }, { status: 400 })
    }
}