"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { 
    User, 
    Mail, 
    Shield, 
    Calendar, 
    FileText, 
    Heart, 
    MessageCircle, 
    Share2, 
    Edit3, 
    LogOut, 
    TrendingUp,
    Clock,
    Eye,
    ThumbsUp,
    BookOpen,
    Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface UserStats {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    likedPosts: number;
    commentedPosts: number;
    sharedPosts: number;
}

interface Post {
    id: string;
    title: string;
    slug: string;
    description?: string;
    image?: string;
    published: boolean;
    createdAt: string;
    Like: any[];
    Comment: any[];
    Share: any[];
}

interface Activity {
    type: 'post' | 'like' | 'comment';
    action: string;
    title: string;
    date: string;
    id: string;
    slug: string;
}

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'activity'>('overview');

    useEffect(() => {
        if (session?.user?.id) {
            fetchProfileData();
        }
    }, [session]);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('/api/profile');
            const data = await response.json();
            if (data.status === 'success') {
                setProfileData(data);
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-2 text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-red-500 font-semibold">You must be logged in to view this page.</p>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'post': return <FileText className="w-4 h-4" />;
            case 'like': return <Heart className="w-4 h-4" />;
            case 'comment': return <MessageCircle className="w-4 h-4" />;
            default: return <Activity className="w-4 h-4" />;
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
            {/* Header Section */}
            <section className="w-full max-w-6xl px-6 py-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-12 h-12 text-primary-foreground" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Welcome, <span className="text-primary">{session.user.name}</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Manage your profile, view your content, and track your activity
                    </p>
                </motion.div>
            </section>

            {/* Profile Information */}
            <section className="w-full max-w-6xl px-6 py-8">
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Profile Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <User className="w-4 h-4" />
                                    <span className="text-sm">Name</span>
                                </div>
                                <p className="font-medium">{session.user.name || "No name set"}</p>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-sm">Email</span>
                                </div>
                                <p className="font-medium">{session.user.email}</p>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-sm">Role</span>
                                </div>
                                <p className="font-medium capitalize">{session.user.role}</p>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">Member Since</span>
                                </div>
                                <p className="font-medium">
                                    {profileData?.user?.createdAt ? formatDate(profileData.user.createdAt) : "Unknown"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Statistics */}
            {profileData?.stats && (
                <section className="w-full max-w-6xl px-6 py-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                        Your Statistics
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <Card className="text-center">
                            <CardContent className="p-4">
                                <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                                <div className="text-2xl font-bold">{profileData.stats.totalPosts}</div>
                                <div className="text-sm text-muted-foreground">Total Posts</div>
                            </CardContent>
                        </Card>
                        
                        <Card className="text-center">
                            <CardContent className="p-4">
                                <Eye className="w-8 h-8 mx-auto mb-2 text-green-500" />
                                <div className="text-2xl font-bold">{profileData.stats.publishedPosts}</div>
                                <div className="text-sm text-muted-foreground">Published</div>
                            </CardContent>
                        </Card>
                        
                        <Card className="text-center">
                            <CardContent className="p-4">
                                <Edit3 className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                                <div className="text-2xl font-bold">{profileData.stats.draftPosts}</div>
                                <div className="text-sm text-muted-foreground">Drafts</div>
                            </CardContent>
                        </Card>
                        
                        <Card className="text-center">
                            <CardContent className="p-4">
                                <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
                                <div className="text-2xl font-bold">{profileData.stats.totalLikes}</div>
                                <div className="text-sm text-muted-foreground">Likes Received</div>
                            </CardContent>
                        </Card>
                        
                        <Card className="text-center">
                            <CardContent className="p-4">
                                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                                <div className="text-2xl font-bold">{profileData.stats.totalComments}</div>
                                <div className="text-sm text-muted-foreground">Comments</div>
                            </CardContent>
                        </Card>
                        
                        <Card className="text-center">
                            <CardContent className="p-4">
                                <Share2 className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                                <div className="text-2xl font-bold">{profileData.stats.totalShares}</div>
                                <div className="text-sm text-muted-foreground">Shares</div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}

            {/* Tabs Navigation */}
            <section className="w-full max-w-6xl px-6 py-8">
                <div className="flex justify-center mb-8">
                    <div className="flex bg-muted rounded-lg p-1">
                        <Button
                            variant={activeTab === 'overview' ? 'default' : 'ghost'}
                            onClick={() => setActiveTab('overview')}
                            className="px-6"
                        >
                            Overview
                        </Button>
                        <Button
                            variant={activeTab === 'posts' ? 'default' : 'ghost'}
                            onClick={() => setActiveTab('posts')}
                            className="px-6"
                        >
                            My Posts
                        </Button>
                        <Button
                            variant={activeTab === 'activity' ? 'default' : 'ghost'}
                            onClick={() => setActiveTab('activity')}
                            className="px-6"
                        >
                            Activity
                        </Button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Recent Posts */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    Recent Posts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {profileData?.posts?.slice(0, 5).map((post: Post) => (
                                    <div key={post.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                                        <div className="flex-1">
                                            <h4 className="font-medium truncate">{post.title}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {post.published ? 'Published' : 'Draft'} • {formatDate(post.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Heart className="w-3 h-3" />
                                                {post.Like.length}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageCircle className="w-3 h-3" />
                                                {post.Comment.length}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {profileData?.posts?.length === 0 && (
                                    <p className="text-muted-foreground text-center py-4">No posts yet</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Engagement Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Engagement
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Posts You Liked</span>
                                        <span className="font-semibold">{profileData?.stats?.likedPosts || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Comments Made</span>
                                        <span className="font-semibold">{profileData?.stats?.commentedPosts || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Posts Shared</span>
                                        <span className="font-semibold">{profileData?.stats?.sharedPosts || 0}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'posts' && (
                    <div className="space-y-6">
                        {profileData?.posts?.map((post: Post) => (
                            <Card key={post.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                                            {post.description && (
                                                <p className="text-muted-foreground mb-4">{post.description}</p>
                                            )}
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {formatDate(post.createdAt)}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    post.published 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {post.published ? 'Published' : 'Draft'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Heart className="w-4 h-4" />
                                                {post.Like.length}
                                            </span>
                                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <MessageCircle className="w-4 h-4" />
                                                {post.Comment.length}
                                            </span>
                                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Share2 className="w-4 h-4" />
                                                {post.Share.length}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {profileData?.posts?.length === 0 && (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                                    <p className="text-muted-foreground mb-4">Start creating content to see your posts here</p>
                                    <Button asChild>
                                        <Link href="/dashboard/createpost">Create Your First Post</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {activeTab === 'activity' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {profileData?.recentActivity?.map((activity: Activity, index: number) => (
                                <div key={index} className="flex items-center gap-4 py-3 border-b last:border-b-0">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm">
                                            You <span className="font-medium">{activity.action}</span> "{activity.title}"
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDate(activity.date)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {profileData?.recentActivity?.length === 0 && (
                                <p className="text-muted-foreground text-center py-8">No recent activity</p>
                            )}
                        </CardContent>
                    </Card>
                )}
            </section>

            {/* Actions */}
            <section className="w-full max-w-6xl px-6 py-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild>
                        <Link href="/dashboard/createpost">
                            <Edit3 className="w-4 h-4 mr-2" />
                            Create New Post
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/posts">
                            <FileText className="w-4 h-4 mr-2" />
                            Manage Posts
                        </Link>
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full border-t py-6 mt-12 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} My Blog. All rights reserved.
            </footer>
        </main>
    );
}
