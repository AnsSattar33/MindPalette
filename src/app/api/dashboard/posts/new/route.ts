import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession, requireRole } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
    try {
        const session = await getAuthSession();
        await requireRole(session, ["admin", "writer"]);

        const posts = await prisma.post.findMany({
            include: { author: true, Like: true, Comment: true, Share: true },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ status: "success", posts });
    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 401 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();
        await requireRole(session, ["admin", "writer"]);

        const contentType = req.headers.get("content-type");
        
        if (contentType?.includes("multipart/form-data")) {
            // Handle form data with image upload
            const formData = await req.formData();
            
            const title = formData.get("title") as string;
            const content = formData.get("content") as string;
            const description = formData.get("description") as string;
            const tags = JSON.parse(formData.get("tags") as string || "[]");
            const category = formData.get("category") as string;
            const published = formData.get("published") === "true";
            const file = formData.get("image") as File;

            if (!title || !content) {
                return NextResponse.json(
                    { status: "error", message: "Title and content are required" },
                    { status: 400 }
                );
            }

            let imageUrl = null;
            
            // Upload image if provided
            if (file && file.size > 0) {
                try {
                    const buffer = Buffer.from(await file.arrayBuffer());
                    
                    const uploadResponse = await new Promise((resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            { 
                                folder: "blog_uploads",
                                resource_type: "auto"
                            },
                            (error, result) => {
                                if (error) reject(error);
                                else resolve(result);
                            }
                        );
                        uploadStream.end(buffer);
                    });

                    imageUrl = (uploadResponse as any).secure_url;
                } catch (uploadError) {
                    console.error("Image upload error:", uploadError);
                    return NextResponse.json(
                        { status: "error", message: "Failed to upload image" },
                        { status: 500 }
                    );
                }
            }

            // Create post with image
            const newPost = await prisma.post.create({
                data: {
                    title,
                    content,
                    description: description || null,
                    tags,
                    category: category || null,
                    image: imageUrl,
                    published,
                    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                    authorId: session?.user?.id,
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    Like: true,
                    Comment: true,
                    Share: true
                }
            });

            return NextResponse.json({ 
                status: "success", 
                message: "Post created successfully", 
                post: newPost 
            });

        } else {
            // Handle JSON data (for API calls without image)
            const { title, content, tags, image, published, description, category } = await req.json();
            
            if (!title || !content) {
                return NextResponse.json(
                    { status: "error", message: "Title and content are required" },
                    { status: 400 }
                );
            }

            const newPost = await prisma.post.create({
                data: {
                    title,
                    content,
                    description: description || null,
                    tags: tags || [],
                    category: category || null,
                    image: image || null,
                    published: published || false,
                    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                    authorId: session?.user?.id,
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    Like: true,
                    Comment: true,
                    Share: true
                }
            });

            return NextResponse.json({ 
                status: "success", 
                message: "Post created successfully", 
                post: newPost 
            });
        }

    } catch (error: any) {
        console.error("Post creation error:", error);
        return NextResponse.json(
            { status: "error", message: error.message || "Failed to create post" }, 
            { status: 500 }
        );
    }
}
