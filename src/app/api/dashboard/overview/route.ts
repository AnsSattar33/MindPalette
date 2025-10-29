import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession, requireRole } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getAuthSession();
        await requireRole(session, ["admin", "writer"]);

        // Get all posts with engagement data
        const posts = await prisma.post.findMany({
            include: {
                author: true,
                Like: true,
                Comment: true,
                Share: true,
            },
            orderBy: { createdAt: "desc" }
        });

        // Get all users (for admin)
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                _count: {
                    select: {
                        posts: true,
                        Like: true,
                        Comment: true,
                        Share: true,
                    }
                }
            }
        });

        // Get all comments with user data
        const comments = await prisma.comment.findMany({
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
            },
            orderBy: { createdAt: "desc" }
        });

        // Calculate statistics
        const stats = {
            totalPosts: posts.length,
            publishedPosts: posts.filter(post => post.published).length,
            draftPosts: posts.filter(post => !post.published).length,
            totalUsers: users.length,
            totalComments: comments.length,
            totalLikes: posts.reduce((sum, post) => sum + post.Like.length, 0),
            totalShares: posts.reduce((sum, post) => sum + post.Share.length, 0),
            adminUsers: users.filter(user => user.role === 'admin').length,
            writerUsers: users.filter(user => user.role === 'writer').length,
            regularUsers: users.filter(user => user.role === 'user').length,
        };

        // Get recent activity (last 20 activities)
        const recentActivity = [
            ...posts.slice(0, 10).map(post => ({
                type: 'post',
                action: post.published ? 'published' : 'created',
                title: post.title,
                date: post.createdAt.toISOString(),
                id: post.id,
                slug: post.slug,
                author: post.author?.name || 'Unknown'
            })),
            ...comments.slice(0, 10).map(comment => ({
                type: 'comment',
                action: 'commented on',
                title: comment.post.title,
                date: comment.createdAt.toISOString(),
                id: comment.id,
                slug: comment.post.slug,
                author: comment.user.name || 'Unknown'
            }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 20);

        // Get top performing posts (by likes)
        const topPosts = posts
            .sort((a, b) => b.Like.length - a.Like.length)
            .slice(0, 5)
            .map(post => ({
                id: post.id,
                title: post.title,
                slug: post.slug,
                likes: post.Like.length,
                comments: post.Comment.length,
                shares: post.Share.length,
                published: post.published,
                createdAt: post.createdAt.toISOString(),
                author: post.author?.name || 'Unknown'
            }));

        // Get recent comments
        const recentComments = comments.slice(0, 10).map(comment => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt.toISOString(),
            user: {
                name: comment.user.name || 'Unknown',
                email: comment.user.email
            },
            post: {
                title: comment.post.title,
                slug: comment.post.slug
            }
        }));

        return NextResponse.json({
            status: "success",
            stats,
            recentActivity,
            topPosts,
            recentComments,
            users: session.user.role === 'admin' ? users : undefined
        });

    } catch (error: any) {
        console.error('Error fetching dashboard overview:', error);
        return NextResponse.json(
            { status: "error", message: "Failed to fetch dashboard data" },
            { status: 500 }
        );
    }
}
