"use client";

import { useState, DragEvent } from "react";
import { Upload, Image as ImageIcon, File as FileIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/reduxHooks";

export default function UploadDropzone({ setUploadedImage, setImagePreview }: { setUploadedImage: (url: File) => void, setImagePreview: (url: string | null) => void }) {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const previewPost = useAppSelector((state) => state.posts.previewPost);
    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    console.log('file', file)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('e.target.files', e.target.files)
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
            setUploadedImage(e.target.files[0]); // Pass the image URL to parent component
        }
    };

    const handleFile = (f: File) => {
        console.log('e.target.files', f)
        setFile(f);
        if (f.type.startsWith("image/")) {
            const url = URL.createObjectURL(f);
            setPreview(url);
            setImagePreview(url);
            // Pass the image URL to parent component
        } else {
            setPreview(null);
        }
    };

    const removeFile = () => {
        setFile(null);
        setPreview(null);
    };

    console.log('previewPost in dropzone = ', typeof previewPost?.image, 'preview = ', preview)

    return (
        <Card className="w-full  mx-auto shadow-sm">
            <CardContent className="p-6">
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                        "flex flex-col items-center justify-center gap-4 rounded-xl  p-10 transition relative",
                        dragActive
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/25 bg-muted/30"
                    )}
                >
                    {file ? (
                        <div className="flex flex-col items-center gap-2">
                            {preview || previewPost?.image ? (
                                <div className="relative ">
                                    <img
                                        src={typeof previewPost?.image === 'string' ? previewPost?.image : preview || ""}
                                        alt="Preview"
                                        className="object-cover rounded-xl w-full h-full"
                                    />
                                    <button
                                        onClick={removeFile}
                                        className="absolute top-2 right-2 bg-white/80 dark:bg-black/60 rounded-full p-1 hover:bg-red-500 hover:text-white"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <FileIcon className="w-12 h-12 text-primary" />
                                    <p className="text-sm font-medium">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            <Upload className="w-12 h-12 text-muted-foreground" />
                            <div className="text-center">
                                <p className="text-sm font-medium">
                                    Drag & drop your file here
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    or click below to browse
                                </p>
                            </div>
                            <Button asChild variant="secondary" className="mt-2">
                                <label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    Choose File
                                </label>
                            </Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
