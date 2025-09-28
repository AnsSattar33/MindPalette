"use client";

import { useSession, signOut } from "next-auth/react";
import { LogIn, User } from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Props {
    mobile?: boolean;
}

export default function AuthLinks({ mobile }: Props) {
    const { data: session } = useSession();

    if (mobile) {
        return (
            <div>
                {session ? (
                    <>
                        <Link href="/profile">Profile</Link>
                        <button onClick={() => signOut()}>Logout</button>
                    </>
                ) : (
                    <Link href="/auth/login">Login</Link>
                )}
            </div>
        );
    }

    if (session) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                        <User className="h-4 w-4" /> {session.user?.name || "Profile"}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <Link href="/auth/login" className="flex items-center gap-2 hover:text-primary">
            <LogIn className="h-4 w-4" />
            Login
        </Link>
    );
}
