"use client"
import React, { useEffect } from 'react'

import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import UploadDropzone from '@/components/UploadDropzone'
import { Card, CardContent } from '@/components/ui/card'
import { setPostPreview, getPosts, savePost } from '@/lib/redux/postSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
    ssr: false,
})

const CreatePost = () => {

    const [editorContent, setEditorContent] = React.useState<string>("")
    const [title, setTitle] = React.useState<string>("")
    const [createPostByPrompt, setCreatePostByPrompt] = React.useState<string>("")
    const [description, setDescription] = React.useState<string>("")
    const [uploadedImage, setUploadedImage] = React.useState<File | null>(null)
    const [imagePreview, setImagePreview] = React.useState<string | null | Blob>("")
    const [tags, setTags] = React.useState<Array<string>>([])
    const [input, setInput] = React.useState<string>("")
    const dispatch = useAppDispatch();
    const previewPost = useAppSelector((state) => state.posts.previewPost)
    const { posts, loading, error } = useAppSelector((state) => state.posts)
    const { isEditing } = useAppSelector((state) => state.posts)
    const router = useRouter();
    const searchParams = useSearchParams();
    const postId = searchParams.get('id');

    useEffect(() => {

        dispatch(getPosts());
    }, [dispatch]);

    useEffect(() => {
        if (previewPost && isEditing !== true) {
            setTitle(previewPost.title || "");
            setDescription(previewPost.description || "");
            setEditorContent(previewPost.content || "");
            setTags(previewPost.tags || []);
            setImagePreview(previewPost?.image || "");
        } else if (isEditing === true) {
            const post = posts.find((p) => p.id === postId);
            if (post) {
                setTitle(post.title || "");
                setDescription(post.description || "");
                setEditorContent(post.content || "");
                setTags(post.tags || []);
                setImagePreview(post?.image || "");
            }
        }

    }, [previewPost])

    const handleImage = async () => {
        if (!uploadedImage) return;

        const formData = new FormData();
        formData.append('file', uploadedImage);

        const res = await fetch('/api/imageupload', {
            method: 'POST',
            body: formData
        })

        const data = await res.json();
        return data;
    }

    const handlePreview = () => {

        dispatch(setPostPreview({
            title: title,
            content: editorContent,
            description: description ?? "",
            image: imagePreview ?? '',
            imageFile: uploadedImage,
            tags: tags,
        }));

        router.push('/dashboard/preview')
    }

    const HandleSavePost = async () => {

        const imageData = await handleImage();

        dispatch(savePost({
            title: title,
            content: editorContent,
            description: description,
            image: imageData.secure_url,
            tags: tags,
            published: true
        }));

        // const res = await fetch('/api/dashboard/posts/new', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'accept': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         title: title,
        //         content: editorContent,
        //         image: imageData.secure_url,
        //         tags: tags,
        //         published: true
        //     })
        // })
        // const data = await res.json();
    }

    const handleTageInput = (e: React.KeyboardEvent<HTMLInputElement>) => {

        if (e.key === 'Enter' && input.trim() !== '') {
            e.preventDefault();
            setTags([...tags, input.trim()]);
            setInput('');
        }
    }

    const removeTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    }

    const removeAllTags = () => {

        setTags([]);
        previewPost?.tags && previewPost?.tags.splice(0, previewPost?.tags.length);
    }

    const checkModel = async () => {

        if (!createPostByPrompt) return alert("Please enter a prompt")
        const response = await axios.post('/api/generate', {
            prompt: createPostByPrompt
        });

        const { title, description, content, tags } = response.data

        setTitle(title || "");
        setDescription(description || "");
        setEditorContent(content || "");
        setTags(tags || [])

        console.log(response.data);
    };
    return (

        <div className="">
            <div className='flex items-center justify-between'>
                <h1 className="text-3xl font-bold mb-6">Create New Post</h1>

                <Button onClick={handlePreview} variant={'default'}>Preview</Button>
            </div>

            <Card className="w-full border-none">

                <CardContent className="p-6 space-y-6 border-none">

                    <div className='flex items-center justify-between'>
                        <div className='w-3/4'>
                            <Input
                                placeholder="Create Post by AI"
                                className="h-12 rounded-xl text-lg"
                                value={createPostByPrompt}
                                onChange={(e) => setCreatePostByPrompt(e.target.value)}
                            />
                        </div>
                        <div className='self-start'>
                            <Button onClick={checkModel}>Create Post By AI</Button>
                        </div>
                    </div>

                    {/* Post Title */}
                    <Input
                        placeholder="Post Title"
                        className="h-12 rounded-xl text-lg"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    {/* Post Description */}
                    <Input
                        placeholder="Post Description"
                        className="h-12 rounded-xl"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    {/* Image Upload */}
                    <div className=" border-gray-300 rounded-xl p-6 text-center hover:border-primary transition">
                        <UploadDropzone postId={postId} setUploadedImage={setUploadedImage} setImagePreview={setImagePreview} />
                    </div>

                    {/* Rich Text Editor */}
                    <div className="rounded-xl border-none p-3">

                        <RichTextEditor
                            value={editorContent}
                            onChange={setEditorContent}
                        />
                    </div>

                    {/* Tags */}
                    <Input
                        placeholder="Tags ...."
                        className="h-12 rounded-xl"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { handleTageInput(e) }}
                    />

                    <div>

                        {tags && tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-block bg-primary text-white rounded-full px-3 py-1 text-sm font-semibold mr-2"
                            >
                                {tag}
                                <Button type='button' variant='ghost' size='icon' className='ml-2 p-0' onClick={() => { removeTag(index) }}>
                                    x
                                </Button>
                            </span>
                        ))}
                        {
                            tags.length > 0 && (
                                <Button type='button' variant='ghost' size='icon' className='ml-2 p-0' onClick={removeAllTags}>
                                    Clear All
                                </Button>
                            )
                        }

                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button
                            onClick={HandleSavePost}
                            className="px-6 py-2 rounded-xl text-lg shadow-md hover:shadow-lg transition"
                        >
                            Submit
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CreatePost