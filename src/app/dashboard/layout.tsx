"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { 
    LayoutDashboard, 
    FileText, 
    Plus, 
    MessageCircle, 
    Users, 
    Settings,
    LogOut,
    User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const links = [
    { href: "/dashboard/overview", label: "Overview", icon: LayoutDashboard, roles: ["admin", "writer"] },
    { href: "/dashboard/posts", label: "Posts", icon: FileText, roles: ["admin", "writer"] },
    { href: "/dashboard/createpost", label: "Create Post", icon: Plus, roles: ["admin", "writer"] },
    { href: "/dashboard/comments", label: "Comments", icon: MessageCircle, roles: ["admin", "writer"] },
    { href: "/dashboard/users", label: "Users", icon: Users, roles: ["admin"] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();

    // Filter links based on user role
    const availableLinks = links.filter(link => 
        link.roles.includes(session?.user?.role || 'user')
    );

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-72 bg-card border-r border-border flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                            <LayoutDashboard className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Dashboard</h2>
                            <p className="text-sm text-muted-foreground">Content Management</p>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{session?.user?.name || "User"}</p>
                            <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {availableLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    pathname === link.href 
                                        ? "bg-primary text-primary-foreground" 
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-border">
                    <Button
                        variant="ghost"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
