"use client"
import React from 'react'
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
const PreviewPage = () => {
    const previewPost = useSelector((state: any) => state.posts.previewPost);
    return (
        <div className='flex justify-center items-center  p-4'>
            <Card className="w-1/4">
                <CardHeader>
                    <CardTitle className="text-2xl">{previewPost?.title || 'Preview Title'}</CardTitle>
                    <div>
                        <p className="text-sm text-muted-foreground">{previewPost?.description || 'Preview Category'}</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <div>
                        <img src={previewPost?.image || '/placeholder.png'} alt={previewPost?.title || 'Preview Title'} width={500} height={300} />
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: previewPost?.content || '<p>Preview Content</p>' }} />
                    <div>
                        {previewPost?.tags && previewPost.tags.length > 0 && (
                            <div className="mt-4">
                                <h3 className="font-semibold mb-2">Tags:</h3>
                                <div className="flex flex-wrap">
                                    {previewPost.tags.map((tag: string, index: number) => (
                                        <span key={index} className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-sm font-semibold mr-2">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default PreviewPage