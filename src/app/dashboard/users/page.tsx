"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
    Users, 
    Search, 
    Filter, 
    MoreVertical, 
    Edit, 
    Trash2, 
    User,
    Calendar,
    FileText,
    ChevronLeft,
    ChevronRight,
    Shield,
    UserCheck
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    _count: {
        posts: number;
        Like: number;
        Comment: number;
        Share: number;
    };
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export default function UsersPage() {
    const { data: session, status } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });

    useEffect(() => {
        if (session?.user?.id) {
            fetchUsers();
        }
    }, [session, pagination.page, searchTerm, roleFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                ...(searchTerm && { search: searchTerm }),
                ...(roleFilter && roleFilter !== "all" && { role: roleFilter })
            });

            const response = await fetch(`/api/dashboard/users?${params}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                setUsers(data.users);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const response = await fetch('/api/dashboard/users', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: userId,
                    role: newRole
                })
            });
            const data = await response.json();
            
            if (data.status === 'success') {
                // Refresh users
                fetchUsers();
            } else {
                alert(data.message || 'Failed to update user role');
            }
        } catch (error) {
            console.error('Error updating user role:', error);
            alert('Failed to update user role');
        }
    };

    const handleDeleteUser = async (userId: string, userName: string) => {
        if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) return;

        try {
            const response = await fetch(`/api/dashboard/users?id=${userId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            
            if (data.status === 'success') {
                // Refresh users
                fetchUsers();
            } else {
                alert(data.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleRoleFilter = (value: string) => {
        setRoleFilter(value === "all" ? "" : value);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'writer': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin': return <Shield className="w-4 h-4" />;
            case 'writer': return <FileText className="w-4 h-4" />;
            default: return <User className="w-4 h-4" />;
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-2 text-muted-foreground">Loading users...</p>
                </div>
            </div>
        );
    }

    if (!session || session.user.role !== "admin") {
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
                    <h1 className="text-3xl font-bold">Users Management</h1>
                    <p className="text-muted-foreground">Manage user accounts and permissions</p>
                </div>
                <div className="text-sm text-muted-foreground">
                    {pagination.total} total users
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
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={handleRoleFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="writer">Writer</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm">
                            <Filter className="w-4 h-4 mr-2" />
                            More Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Users List */}
            <div className="space-y-4">
                {users.map((user) => (
                    <Card key={user.id}>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                {/* User Avatar */}
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-primary" />
                                </div>

                                {/* User Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-medium text-lg">{user.name || "No Name"}</span>
                                        <Badge className={getRoleBadgeColor(user.role)}>
                                            {getRoleIcon(user.role)}
                                            <span className="ml-1 capitalize">{user.role}</span>
                                        </Badge>
                                    </div>
                                    
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {user.email}
                                    </p>

                                    {/* User Stats */}
                                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <FileText className="w-3 h-3" />
                                            <span>{user._count.posts} posts</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <UserCheck className="w-3 h-3" />
                                            <span>{user._count.Like} likes</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{user._count.Comment} comments</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {/* Role Change */}
                                    <Select 
                                        value={user.role} 
                                        onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                                        disabled={user.id === session.user.id}
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="writer">Writer</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* More Actions */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit Profile
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={() => handleDeleteUser(user.id, user.name || user.email)}
                                                disabled={user.id === session.user.id}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete User
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {users.length === 0 && !loading && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-xl font-semibold mb-2">No users found</h3>
                            <p className="text-muted-foreground">
                                {searchTerm || roleFilter ? "Try adjusting your search criteria" : "No users have been registered yet"}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
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
