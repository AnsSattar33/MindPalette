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

export async function POST(req: Request) {

    try {
        const { content, authorId, postId } = await req.json()
        console.log('content = ', content, "postId = ", postId, "userId = ", authorId, "req.json() = ", req?.json())
        if (!content || !authorId || !postId) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 })
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                userId: authorId,
                postId,
            },
        })

        return NextResponse.json({ status: "success", message: "Comment created successfully", comment })

    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 400 })
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