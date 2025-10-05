"use client";
import React, { useEffect, useState } from "react";
import { getPosts } from "@/lib/redux/postSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Blog = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6; // 👈 show only 4 posts per page

    const dispatch = useAppDispatch();
    const { posts, loading, error } = useAppSelector((state) => state.posts);

    useEffect(() => {
        dispatch(getPosts());
    }, [dispatch]);

    // Calculate paginated posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(posts.length / postsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    return (
        <div>
            <h1 className="text-4xl font-bold text-start my-8 mx-auto container">
                Blog Posts
            </h1>

            {loading && <div className="text-center">Loading...</div>}
            {error && (
                <div className="text-red-500 font-semibold text-center">{error}</div>
            )}

            {/* Posts */}
            <div className="flex flex-wrap justify-center items-start gap-8 p-4">
                {currentPosts.map((post: any) => (
                    <Card key={post.id} className="w-1/4">
                        <CardHeader>
                            <CardTitle className="text-2xl">{post.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {post.description ?? ""}
                            </p>
                        </CardHeader>
                        <CardContent>
                            {post.image && (
                                <div className="mb-3">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="rounded-md object-cover w-full"
                                    />
                                </div>
                            )}
                            <div
                                className="prose dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center gap-4 my-6">
                <Button onClick={handlePrev} disabled={currentPage === 1}>
                    Previous
                </Button>
                <span className="text-lg font-semibold">
                    Page {currentPage} of {totalPages}
                </span>
                <Button onClick={handleNext} disabled={currentPage === totalPages}>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Blog;
