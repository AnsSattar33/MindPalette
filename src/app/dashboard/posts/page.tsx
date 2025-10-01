"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
    ssr: false,
});
interface Post {
    id: string;
    title: string;
    content: string;
    tags: string[];
    published: boolean;
}

export default function PostsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [posts, setPosts] = useState<Post[]>([]);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [editorContent, setEditorContent] = useState<string>("");

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch("/api/dashboard/posts/new");
            const data = await res.json();
            if (res.ok) {
                setPosts(data.posts);
            }
        };
        fetchPosts();
    }, []);

    if (status === "loading") {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
    }

    if (!session || (session.user.role !== "admin" && session.user.role !== "writer")) {
        return (
            <div className="flex min-h-screen items-center justify-center text-red-500 font-semibold">
                You are not authorized to view posts.
            </div>
        );
    }

    const handleEdit = (post: Post) => {
        setEditingPostId(post.id);
        setEditorContent(post.content);
    };

    const handleSave = async (postId: string) => {
        const res = await fetch(`/api/dashboard/posts/${postId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: editorContent }),
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            setEditingPostId(null);
            // refresh posts
            const updated = posts.map((p) => (p.id === postId ? { ...p, content: editorContent } : p));
            setPosts(updated);
        } else {
            alert(data.message || "Failed to update post");
        }
    };

    const handleDelete = async (postId: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        const res = await fetch(`/api/dashboard/posts/${postId}`, {
            method: "DELETE",
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            setPosts(posts.filter((p) => p.id !== postId));
        } else {
            alert(data.message || "Failed to delete post");
        }
    };

    return (
        <main className="min-h-screen bg-background px-6 py-12">
            <h1 className="text-2xl font-bold mb-6 text-center">Manage Posts</h1>

            <div className="grid gap-6">
                {posts.map((post) => (
                    <Card key={post.id} className="shadow-md">
                        <CardContent className="p-6 space-y-4">
                            <Input
                                type="text"
                                defaultValue={post.title}
                                disabled
                                className="font-bold text-lg"
                            />

                            {editingPostId === post.id ? (
                                <RichTextEditor value={editorContent} onChange={setEditorContent} />
                            ) : (
                                <div
                                    className="prose dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            )}

                            <div className="flex gap-3 mt-4">
                                {editingPostId === post.id ? (
                                    <>
                                        <Button onClick={() => handleSave(post.id)}>Save</Button>
                                        <Button variant="secondary" onClick={() => setEditingPostId(null)}>
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        {console.log('post', post)}
                                        <Button onClick={() => handleEdit(post)}>Edit</Button>
                                        <Button variant="destructive" onClick={() => handleDelete(post.id)}>
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </main>
    );
}
