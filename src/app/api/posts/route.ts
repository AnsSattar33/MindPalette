import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            where: {
                published: true,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                Like: true,
                Comment: true,
                Share: true,
            },
            orderBy: { createdAt: "desc" },
            take: 10, // Limit to 10 posts for home page
        });

        return NextResponse.json({ 
            status: "success", 
            posts 
        });
    } catch (error: any) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { status: "error", message: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}
