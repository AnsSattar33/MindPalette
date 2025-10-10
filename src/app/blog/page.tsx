"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getPosts } from "@/lib/redux/postSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Pencil, Repeat2, Share, Share2, Trash } from "lucide-react";
import { getComments, createComment, updateComment, likePost } from "@/lib/redux/socialSlice";
import { Input } from "@/components/ui/input";
import DOMPurify from "dompurify"
import axios from "axios";

interface Comments {
    id: string;
    content: string;
}

const Blog = () => {
    const [isCommentEditable, setIsCommentEditable] = useState<string>()
    const [commentContent, setCommentContent] = useState<string>('')
    const [isCommentSectionOpen, SetIsCommentSectionOpen] = useState<boolean>(false)
    const [isCommentEditableOpen, SetIsCommentEditableOpen] = useState<boolean>(false)
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6; // 👈 show only 4 posts per page

    const dispatch = useAppDispatch();
    const { data: session } = useSession();
    const { posts, loading, error } = useAppSelector((state) => state.posts);
    const { comments } = useAppSelector((state) => state.social);
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

    const handleMessages = async (id: string) => {
        dispatch(getComments(id))
        setIsCommentEditable(id)
        SetIsCommentSectionOpen(true)
    }

    const HandleSendComment = async (comment?: Comments) => {

        if (isCommentEditableOpen) {
            dispatch(updateComment({ content: commentContent, id: comment?.id }))
        } else {
            dispatch(createComment({ content: commentContent, postId: isCommentEditable, authorId: session?.user?.id }))
        }
        setIsCommentEditable('')
        setCommentContent('')
        SetIsCommentSectionOpen(false)
    }

    const handleEdit = async (commentContent: string, postId: string) => {
        setIsCommentEditable(postId)
        setCommentContent(commentContent)

        SetIsCommentEditableOpen(true)

    }


    const handleLike = async (postId: string) => {
        console.log("its running = ", postId)
        dispatch(likePost({ id: postId, userId: session?.user?.id }))

    }

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
            <div className="flex md:flex-wrap justify-center items-start gap-8 p-4">
                {currentPosts.map((post: any) => (
                    <Card key={post.id} className="md:w-1/4">
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
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post?.content) }}
                            />
                        </CardContent>
                        <div className='flex justify-between gap-2 px-8'>
                            <div>
                                <Button onClick={() => handleLike(post?.id)}>
                                    <Heart />
                                </Button>
                            </div>
                            <div>
                                <Button onClick={() => handleMessages(post?.id)}>
                                    <MessageCircle />
                                </Button>
                            </div>
                            <div>
                                <Repeat2 />
                            </div>
                            <div>
                                <Share />
                            </div>
                            {/* <div>
                                <Trash color='#ff0000' />
                            </div> */}
                        </div>
                        {
                            isCommentSectionOpen && (
                                <div>
                                    {
                                        isCommentEditable === post?.id &&
                                        (
                                            <div className="px-8">
                                                <div className="flex items-center gap-2">
                                                    <Input value={commentContent} onChange={(e) => setCommentContent(e.target.value)} placeholder="Comment..." />
                                                    <Button onClick={() => HandleSendComment()}>Send</Button>
                                                </div>
                                                <div>
                                                    <div className="py-4">Comments: {comments?.length}</div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    {comments &&
                                        comments
                                            .filter((comment: any) => comment.postId === post.id)
                                            .map((comment: any) => (
                                                <div
                                                    key={comment.id}
                                                    className="mb-4 w-full rounded-2xl bg-gray-50 p-4 shadow-sm transition hover:shadow-md"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        {/* Avatar */}
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold">
                                                            {comment.user?.name?.charAt(0).toUpperCase() || "U"}
                                                        </div>

                                                        {/* Comment Content */}
                                                        <div className="flex flex-col flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-sm font-semibold text-gray-800">
                                                                    {comment.user?.name || "Unknown User"}
                                                                </p>
                                                                {/* Edit Icon */}
                                                                <button
                                                                    onClick={() => handleEdit(comment?.content, post?.id)}
                                                                    className="text-gray-400 hover:text-indigo-500 transition"
                                                                    title="Edit Comment"
                                                                >
                                                                    <Pencil size={16} />
                                                                </button>
                                                            </div>

                                                            <p className="text-sm text-gray-600 mt-1">{comment.content}</p>

                                                            {/* Optional Timestamp */}
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {new Date(comment.createdAt).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                </div>
                            )
                        }

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
