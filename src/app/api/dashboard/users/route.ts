import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession, requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getAuthSession();
        await requireRole(session, ["admin"]);

        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "10");
        const search = url.searchParams.get("search") || "";
        const role = url.searchParams.get("role") || "";

        const skip = (page - 1) * limit;

        // Build where clause for search and role filter
        const whereClause: any = {};
        
        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: "insensitive" as const } },
                { email: { contains: search, mode: "insensitive" as const } }
            ];
        }
        
        if (role) {
            whereClause.role = role;
        }

        const users = await prisma.user.findMany({
            where: whereClause,
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
            },
            orderBy: { name: "asc" },
            skip,
            take: limit
        });

        const totalUsers = await prisma.user.count({
            where: whereClause
        });

        return NextResponse.json({
            status: "success",
            users,
            pagination: {
                page,
                limit,
                total: totalUsers,
                pages: Math.ceil(totalUsers / limit)
            }
        });

    } catch (error: any) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { status: "error", message: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getAuthSession();
        await requireRole(session, ["admin"]);

        const { id, role } = await req.json();
        
        if (!id || !role) {
            return NextResponse.json(
                { status: "error", message: "User ID and role are required" },
                { status: 400 }
            );
        }

        if (!['admin', 'writer', 'user'].includes(role)) {
            return NextResponse.json(
                { status: "error", message: "Invalid role" },
                { status: 400 }
            );
        }

        // Prevent admin from changing their own role
        if (id === session?.user?.id) {
            return NextResponse.json(
                { status: "error", message: "Cannot change your own role" },
                { status: 400 }
            );
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role },
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

        return NextResponse.json({
            status: "success",
            message: "User role updated successfully",
            user: updatedUser
        });

    } catch (error: any) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { status: "error", message: "Failed to update user" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getAuthSession();
        await requireRole(session, ["admin"]);

        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { status: "error", message: "User ID is required" },
                { status: 400 }
            );
        }

        // Prevent admin from deleting themselves
        if (id === session?.user?.id) {
            return NextResponse.json(
                { status: "error", message: "Cannot delete your own account" },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true }
        });

        if (!user) {
            return NextResponse.json(
                { status: "error", message: "User not found" },
                { status: 404 }
            );
        }

        // Delete user (cascade will handle related records)
        await prisma.user.delete({
            where: { id }
        });

        return NextResponse.json({
            status: "success",
            message: `User ${user.name || user.email} deleted successfully`
        });

    } catch (error: any) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { status: "error", message: "Failed to delete user" },
            { status: 500 }
        );
    }
}
