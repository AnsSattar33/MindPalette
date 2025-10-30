import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getAuthSession();
        
        if (!session?.user?.id) {
            return NextResponse.json(
                { status: "error", message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get user with all related data
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                posts: {
                    include: {
                        Like: true,
                        Comment: true,
                        Share: true,
                    },
                    orderBy: { createdAt: "desc" }
                },
                Like: {
                    include: {
                        post: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                                image: true,
                                createdAt: true,
                                author: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { createdAt: "desc" }
                },
                Comment: {
                    include: {
                        post: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                                image: true,
                                createdAt: true,
                                author: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { createdAt: "desc" }
                },
                Share: {
                    include: {
                        post: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                                image: true,
                                createdAt: true,
                                author: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { createdAt: "desc" }
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                { status: "error", message: "User not found" },
                { status: 404 }
            );
        }

        // Calculate statistics
        const stats = {
            totalPosts: user.posts.length,
            publishedPosts: user.posts.filter((post: any) => post.published).length,
            draftPosts: user.posts.filter((post: any) => !post.published).length,
            totalLikes: user.posts.reduce((sum: number, post: any) => sum + post.Like.length, 0),
            totalComments: user.posts.reduce((sum: number, post: any) => sum + post.Comment.length, 0),
            totalShares: user.posts.reduce((sum: number, post: any) => sum + post.Share.length, 0),
            likedPosts: user.Like.length,
            commentedPosts: user.Comment.length,
            sharedPosts: user.Share.length,
        };

        // Get recent activity (last 10 activities)
        const recentActivity = [
            ...user.posts.slice(0, 5).map((post: any) => ({
                type: 'post',
                action: post.published ? 'published' : 'created',
                title: post.title,
                date: post.createdAt.toISOString(),
                id: post.id,
                slug: post.slug
            })),
            ...user.Like.slice(0, 3).map((like: any) => ({
                type: 'like',
                action: 'liked',
                title: like.post.title,
                date: like.createdAt.toISOString(),
                id: like.post.id,
                slug: like.post.slug
            })),
            ...user.Comment.slice(0, 2).map((comment: any) => ({
                type: 'comment',
                action: 'commented on',
                title: comment.post.title,
                date: comment.createdAt.toISOString(),
                id: comment.post.id,
                slug: comment.post.slug
            }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

        return NextResponse.json({
            status: "success",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: new Date().toISOString(), // User model doesn't have createdAt
            },
            stats,
            posts: user.posts,
            recentActivity
        });

    } catch (error: any) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { status: "error", message: "Failed to fetch profile data" },
            { status: 500 }
        );
    }
}
