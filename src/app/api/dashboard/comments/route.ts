import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession, requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getAuthSession();
        await requireRole(session, ["admin", "writer"]);

        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "10");
        const search = url.searchParams.get("search") || "";

        const skip = (page - 1) * limit;

        // Build where clause for search
        const whereClause = search ? {
            OR: [
                { content: { contains: search, mode: "insensitive" as const } },
                { user: { name: { contains: search, mode: "insensitive" as const } } },
                { post: { title: { contains: search, mode: "insensitive" as const } } }
            ]
        } : {};

        const comments = await prisma.comment.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                },
                post: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        published: true,
                        author: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit
        });

        const totalComments = await prisma.comment.count({
            where: whereClause
        });

        return NextResponse.json({
            status: "success",
            comments,
            pagination: {
                page,
                limit,
                total: totalComments,
                pages: Math.ceil(totalComments / limit)
            }
        });

    } catch (error: any) {
        console.error('Error fetching comments:', error);
        return NextResponse.json(
            { status: "error", message: "Failed to fetch comments" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();
        await requireRole(session, ["admin", "writer"]);

        // Type assertion since requireRole throws if session is null
        if (!session || !session.user) {
            return NextResponse.json(
                { status: "error", message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { content, postId } = await req.json();
        
        if (!content || !postId) {
            return NextResponse.json(
                { status: "error", message: "Content and post ID are required" },
                { status: 400 }
            );
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                userId: session.user.id,
                postId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                post: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                }
            }
        });

        return NextResponse.json({
            status: "success",
            message: "Comment created successfully",
            comment
        });

    } catch (error: any) {
        console.error('Error creating comment:', error);
        return NextResponse.json(
            { status: "error", message: "Failed to create comment" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getAuthSession();
        await requireRole(session, ["admin", "writer"]);

        // Type assertion since requireRole throws if session is null
        if (!session || !session.user) {
            return NextResponse.json(
                { status: "error", message: "Unauthorized" },
                { status: 401 }
            );
        }

        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { status: "error", message: "Comment ID is required" },
                { status: 400 }
            );
        }

        // Check if user owns the comment or is admin
        const comment = await prisma.comment.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!comment) {
            return NextResponse.json(
                { status: "error", message: "Comment not found" },
                { status: 404 }
            );
        }

        if (comment.userId !== session.user.id && session.user.role !== 'admin') {
            return NextResponse.json(
                { status: "error", message: "Unauthorized to delete this comment" },
                { status: 403 }
            );
        }

        await prisma.comment.delete({
            where: { id }
        });

        return NextResponse.json({
            status: "success",
            message: "Comment deleted successfully"
        });

    } catch (error: any) {
        console.error('Error deleting comment:', error);
        return NextResponse.json(
            { status: "error", message: "Failed to delete comment" },
            { status: 500 }
        );
    }
}