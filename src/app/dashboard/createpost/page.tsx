"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from "framer-motion";
import { 
    Save, 
    Eye, 
    Upload, 
    X, 
    Plus, 
    Tag, 
    FileText, 
    Image as ImageIcon,
    AlertCircle,
    CheckCircle,
    Loader2
} from "lucide-react";
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
    ssr: false,
});

const categories = [
    "Web Development",
    "React",
    "TypeScript",
    "JavaScript",
    "CSS",
    "HTML",
    "Node.js",
    "Database",
    "Authentication",
    "Redux",
    "Next.js",
    "Vercel",
    "Accessibility",
    "UI/UX",
    "Design",
    "Tutorial",
    "Tips & Tricks",
    "News",
    "Review",
    "Other"
];

export default function CreatePost() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const postId = searchParams.get('id');

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [published, setPublished] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Check authentication
    useEffect(() => {
        if (status === "loading") return;
        if (!session || (session.user.role !== "admin" && session.user.role !== "writer")) {
            router.push("/");
        }
    }, [session, status, router]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim() !== '') {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const clearAllTags = () => {
        setTags([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim() || !content.trim()) {
            setError("Title and content are required");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('tags', JSON.stringify(tags));
            formData.append('published', published.toString());
            
            if (image) {
                formData.append('image', image);
            }

            const response = await fetch('/api/dashboard/posts/new', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.status === 'success') {
                setSuccess("Post created successfully!");
                // Reset form
                setTitle("");
                setDescription("");
                setContent("");
                setCategory("");
                setTags([]);
                setImage(null);
                setImagePreview(null);
                setPublished(false);
                
                // Redirect to posts page after 2 seconds
                setTimeout(() => {
                    router.push('/dashboard/posts');
                }, 2000);
            } else {
                setError(data.message || "Failed to create post");
            }
        } catch (error) {
            console.error('Error creating post:', error);
            setError("An error occurred while creating the post");
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = () => {
        // Create a preview object and navigate to preview page
        const previewData = {
            title,
            content,
            description,
            category,
            tags,
            image: imagePreview,
            published
        };
        
        // Store in sessionStorage for preview page
        sessionStorage.setItem('postPreview', JSON.stringify(previewData));
        router.push('/dashboard/preview');
    };

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session || (session.user.role !== "admin" && session.user.role !== "writer")) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Create New Post</h1>
                    <p className="text-muted-foreground">Write and publish your content</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handlePreview}
                        disabled={!title || !content}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Post Title
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Input
                                    placeholder="Enter your post title..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="text-lg"
                                    required
                                />
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="Brief description of your post..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                />
                            </CardContent>
                        </Card>

                        {/* Content Editor */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Content</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RichTextEditor
                                    value={content}
                                    onChange={setContent}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Publish Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Publish Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="published">Publish immediately</Label>
                                    <Switch
                                        id="published"
                                        checked={published}
                                        onCheckedChange={setPublished}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Category */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        {/* Image Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5" />
                                    Featured Image
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-2 right-2"
                                            onClick={removeImage}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                        <Label htmlFor="image" className="cursor-pointer">
                                            <span className="text-sm text-muted-foreground">
                                                Click to upload image
                                            </span>
                                        </Label>
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Tags */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Tag className="w-5 h-5" />
                                    Tags
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Input
                                    placeholder="Add a tag and press Enter"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagInput}
                                />
                                
                                {tags.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                    {tag}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-auto p-0 ml-1"
                                                        onClick={() => removeTag(index)}
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </Badge>
                                            ))}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={clearAllTags}
                                        >
                                            Clear All
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={loading || !title || !content}
                        className="px-8"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                {published ? 'Publish Post' : 'Save as Draft'}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}