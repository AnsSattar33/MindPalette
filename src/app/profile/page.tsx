"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
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

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-6">
            <Card className="w-full max-w-md shadow-lg">
                <CardContent className="p-6 space-y-6">
                    <h1 className="text-2xl font-bold text-center">My Profile</h1>

                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{session.user.name || "No name set"}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{session.user.email}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Role</p>
                            <p className="font-medium capitalize">{session.user.role}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">User ID</p>
                            <p className="text-xs text-gray-500">{session.user.id}</p>
                        </div>
                    </div>

                    <Button
                        variant="destructive"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => signOut({ callbackUrl: "/" })}
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
