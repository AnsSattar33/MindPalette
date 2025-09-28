"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

interface Props {
    mobile?: boolean;
}

export default function AdminLinks({ mobile }: Props) {
    const { data: session } = useSession();

    // Example: Only show if user role is admin
    // || session.user?.role !== "admin"
    if (!session) return null;

    const links = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Posts", href: "/dashboard/posts" },
        { name: "Create Post", href: "/dashboard/posts/new" },
        { name: "Comments", href: "/dashboard/comments" },
        { name: "Users", href: "/dashboard/users" },
    ];

    return (
        <div className={mobile ? "flex flex-col gap-3" : "flex gap-6"}>
            {links.map((link) => (
                <Link
                    key={link.name}
                    href={link.href}
                    className="hover:text-primary transition-colors"
                >
                    {link.name}
                </Link>
            ))}
        </div>
    );
}
