"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
    MessageCircle, 
    Search, 
    Filter, 
    MoreVertical, 
    Edit, 
    Trash2, 
    User,
    Calendar,
    FileText,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
    post: {
        id: string;
        title: string;
        slug: string;
        published: boolean;
        author: {
            name: string;
        };
    };
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export default function CommentsPage() {
    const { data: session, status } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });

    useEffect(() => {
        if (session?.user?.id) {
            fetchComments();
        }
    }, [session, pagination.page, searchTerm]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                ...(searchTerm && { search: searchTerm })
            });

            const response = await fetch(`/api/dashboard/comments?${params}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                setComments(data.comments);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        try {
            const response = await fetch(`/api/dashboard/comments?id=${commentId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            
            if (data.status === 'success') {
                // Refresh comments
                fetchComments();
            } else {
                alert(data.message || 'Failed to delete comment');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment');
        }
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'writer': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-2 text-muted-foreground">Loading comments...</p>
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Comments Management</h1>
                    <p className="text-muted-foreground">Manage and moderate comments</p>
                </div>
                <div className="text-sm text-muted-foreground">
                    {pagination.total} total comments
                </div>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                type="text"
                                placeholder="Search comments, users, or posts..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button variant="outline" size="sm">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Comments List */}
            <div className="space-y-4">
                {comments.map((comment) => (
                    <Card key={comment.id}>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                {/* User Avatar */}
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary" />
                                </div>

                                {/* Comment Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-medium">{comment.user.name}</span>
                                        <Badge className={getRoleBadgeColor(comment.user.role)}>
                                            {comment.user.role}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                    </div>
                                    
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {comment.content}
                                    </p>

                                    {/* Post Info */}
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <FileText className="w-3 h-3" />
                                        <span>on "{comment.post.title}"</span>
                                        <span>by {comment.post.author.name}</span>
                                        <Badge variant={comment.post.published ? "default" : "secondary"}>
                                            {comment.post.published ? "Published" : "Draft"}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Actions */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {comments.length === 0 && !loading && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-xl font-semibold mb-2">No comments found</h3>
                            <p className="text-muted-foreground">
                                {searchTerm ? "Try adjusting your search criteria" : "No comments have been made yet"}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} comments
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            disabled={pagination.page === 1}
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {pagination.page} of {pagination.pages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page === pagination.pages}
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
