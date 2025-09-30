"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

export default function CreatePostPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [published, setPublished] = useState(false);
    const [loading, setLoading] = useState(false);

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }
    console.log(session);
    if (!session || (session.user.role !== "admin" && session.user.role !== "writer")) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-red-500 font-semibold">
                    You are not authorized to create posts.
                </p>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/dashboard/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                content,
                tags: tags.split(",").map((t) => t.trim()),
                published,
            }),
        });

        const data = await res.json();
        setLoading(false);

        if (res.ok) {
            alert(data.message);
            router.push("/dashboard/posts");
        } else {
            alert(data.message || "Failed to create post");
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardContent className="p-6 space-y-6">
                    <h1 className="text-2xl font-bold text-center">Create New Post</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <Input
                                type="text"
                                placeholder="Enter post title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Content</label>
                            <Textarea
                                placeholder="Write your content here..."
                                rows={6}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Tags</label>
                            <Input
                                type="text"
                                placeholder="e.g. javascript, react, prisma"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Separate tags with commas.
                            </p>
                        </div>

                        {/* Published Toggle */}
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={published}
                                onCheckedChange={setPublished}
                            />
                            <span className="text-sm">Publish immediately</span>
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Creating..." : "Create Post"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
