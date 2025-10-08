import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextResponse, context: { params: Promise<{ id: string }> }) {

    try {
        // const { searchParams } = new URL(req.url)
        // console.log("searchParams = ", searchParams)
        // const id = searchParams.get("id")
        const { id } = await context.params

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

export async function PUT(req: NextRequest) {

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "Comment id is required" }, { status: 400 })
        }

        const { content } = await req.json()

        const comment = await prisma.comment.update({
            where: {
                id: id,
            },
            data: {
                content,
            },
        })

        return NextResponse.json({ status: "success", message: "Comment updated successfully", comment })

    } catch (error) {

        return NextResponse.json({ status: "error", message: error }, { status: 400 })
    }
}

export async function DELETE(req: NextRequest) {

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "Comment id is required" }, { status: 400 })
        }

        await prisma.comment.delete({
            where: {
                id: id,
            },
        })

        return NextResponse.json({ status: "success", message: "Comment deleted successfully" })

    } catch (error) {

        return NextResponse.json({ status: "error", message: error }, { status: 400 })
    }
}