"use client";

import { useState, useEffect } from "react";
import ExpandableCardDemo from "@/components/expandable-card-demo-grid";
import ExpandableCardDemoStandard from "@/components/expandable-card-demo-standard"
import { HoverEffect } from "@/components/ui/card-hover-effect";

interface Post {
    id: string;
    title: string;
    description?: string;
    content?: string;
    image?: string;
    tags: string[];
    createdAt: string;
    author: {
        id: string;
        name: string;
        email: string;
    };
    Like: any[];
    Comment: any[];
    Share: any[];
}

export default function LandingPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/posts');
            const data = await response.json();
            if (data.status === 'success') {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get unique categories from post tags
    const getCategories = () => {
        const allTags = posts.flatMap(post => post.tags);
        const uniqueTags = [...new Set(allTags)];
        return uniqueTags.slice(0, 6).map((tag, index) => ({
            id: index + 1,
            title: tag,
            description: `Latest articles about ${tag}`,
            link: `/blog?tag=${tag}`
        }));
    };

    // Convert posts to card format for expandable cards
    const getPostCards = (posts: Post[]) => {
        return posts.slice(0, 12).map((post, index) => ({
            description: post.author.name,
            title: post.title,
            src: post.image || `https://images.unsplash.com/photo-${1500000000000 + index}?w=400&h=300&fit=crop`,
            ctaText: "Read More",
            ctaLink: `/blog/${post.id}`,
            content: () => {
                return (
                    <div>
                        <p className="mb-4">{post.description || "Read this amazing article..."}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, tagIndex) => (
                                <span key={tagIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="text-sm text-gray-500">
                            <p>Author: {post.author.name}</p>
                            <p>Published: {new Date(post.createdAt).toLocaleDateString()}</p>
                            <p>Likes: {post.Like.length} | Comments: {post.Comment.length}</p>
                        </div>
                    </div>
                );
            },
        }));
    };

    const categories = getCategories();
    const postCards = getPostCards(posts);

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="w-full max-w-5xl px-6 py-16 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    Welcome to <span className="text-primary">My Blog</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                    Discover articles, tutorials, and insights on web development, design,
                    and technology. Stay updated with the latest trends and tips.
                </p>
                {loading && (
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="mt-2 text-muted-foreground">Loading posts...</p>
                    </div>
                )}
            </section>

            {/* Card Hover Section - Categories */}
            <section className="w-full max-w-6xl px-4 py-12">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                    Featured Categories
                </h2>
                {categories.length > 0 ? (
                    <HoverEffect items={categories} />
                ) : !loading && (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No categories available yet.</p>
                    </div>
                )}
            </section>

            {/* Expandable Cards Section - Blog Posts */}
            <section className="w-full max-w-6xl px-4 py-12">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                    Latest Articles
                </h2>
                {postCards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ExpandableCardDemo posts={postCards.slice(0, 4)} />
                        <ExpandableCardDemoStandard posts={postCards.slice(4, 12)} />
                    </div>
                ) : !loading && (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No articles published yet.</p>
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="w-full border-t py-6 mt-12 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} My Blog. All rights reserved.
            </footer>
        </main>
    );
}
