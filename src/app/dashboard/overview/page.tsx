"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { 
    FileText, 
    Eye, 
    Edit3, 
    Users, 
    MessageCircle, 
    Heart, 
    Share2, 
    TrendingUp,
    Clock,
    User,
    Calendar,
    BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DashboardStats {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalUsers: number;
    totalComments: number;
    totalLikes: number;
    totalShares: number;
    adminUsers: number;
    writerUsers: number;
    regularUsers: number;
}

interface Activity {
    type: 'post' | 'comment';
    action: string;
    title: string;
    date: string;
    id: string;
    slug: string;
    author: string;
}

interface TopPost {
    id: string;
    title: string;
    slug: string;
    likes: number;
    comments: number;
    shares: number;
    published: boolean;
    createdAt: string;
    author: string;
}

interface RecentComment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
    post: {
        title: string;
        slug: string;
    };
}

export default function DashboardOverview() {
    const { data: session, status } = useSession();
    const [dashboardData, setDashboardData] = useState<{
        stats: DashboardStats;
        recentActivity: Activity[];
        topPosts: TopPost[];
        recentComments: RecentComment[];
        users?: any[];
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.id) {
            fetchDashboardData();
        }
    }, [session]);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/api/dashboard/overview');
            const data = await response.json();
            if (data.status === 'success') {
                setDashboardData(data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!session || (session.user.role !== "admin" && session.user.role !== "writer")) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-red-500 font-semibold">You are not authorized to view this page.</p>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'post': return <FileText className="w-4 h-4" />;
            case 'comment': return <MessageCircle className="w-4 h-4" />;
            default: return <TrendingUp className="w-4 h-4" />;
        }
    };

    const stats = dashboardData?.stats;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard Overview</h1>
                    <p className="text-muted-foreground">Welcome back, {session.user.name}</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/dashboard/createpost">
                            <Edit3 className="w-4 h-4 mr-2" />
                            Create Post
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/posts">
                            <FileText className="w-4 h-4 mr-2" />
                            Manage Posts
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                                    <p className="text-2xl font-bold">{stats.totalPosts}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Eye className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Published</p>
                                    <p className="text-2xl font-bold">{stats.publishedPosts}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Edit3 className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                                    <p className="text-2xl font-bold">{stats.draftPosts}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <MessageCircle className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Comments</p>
                                    <p className="text-2xl font-bold">{stats.totalComments}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <Heart className="w-6 h-6 text-red-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Likes</p>
                                    <p className="text-2xl font-bold">{stats.totalLikes}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Share2 className="w-6 h-6 text-orange-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Shares</p>
                                    <p className="text-2xl font-bold">{stats.totalShares}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {session.user.role === 'admin' && (
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <BarChart3 className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-muted-foreground">Admins</p>
                                        <p className="text-2xl font-bold">{stats.adminUsers}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {dashboardData?.recentActivity?.slice(0, 8).map((activity, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm">
                                            <span className="font-medium">{activity.author}</span> {activity.action} "{activity.title}"
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDate(activity.date)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {dashboardData?.recentActivity?.length === 0 && (
                                <p className="text-muted-foreground text-center py-4">No recent activity</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Performing Posts */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Top Performing Posts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {dashboardData?.topPosts?.map((post, index) => (
                                <div key={post.id} className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium truncate">{post.title}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            by {post.author} • {formatDate(post.createdAt)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Heart className="w-3 h-3" />
                                            {post.likes}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle className="w-3 h-3" />
                                            {post.comments}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Share2 className="w-3 h-3" />
                                            {post.shares}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {dashboardData?.topPosts?.length === 0 && (
                                <p className="text-muted-foreground text-center py-4">No posts yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Comments */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Recent Comments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {dashboardData?.recentComments?.slice(0, 5).map((comment) => (
                            <div key={comment.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm">{comment.user.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            on "{comment.post.title}"
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {comment.content}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatDate(comment.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {dashboardData?.recentComments?.length === 0 && (
                            <p className="text-muted-foreground text-center py-4">No comments yet</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}