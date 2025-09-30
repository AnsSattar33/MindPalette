"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
    { href: "/dashboard/overview", label: "Overview" },
    { href: "/dashboard/posts", label: "Posts" },
    { href: "/dashboard/posts/new", label: "Create Post" },
    { href: "/dashboard/comments", label: "Comments" },
    { href: "/dashboard/users", label: "Users" }, // Admin only
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    console.log("pathname = ", pathname)
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-muted border-r p-4 space-y-2">
                <h2 className="text-xl font-bold mb-4">Dashboard</h2>
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "block px-3 py-2 rounded hover:bg-accent",
                            pathname === link.href ? "bg-accent font-semibold" : ""
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
