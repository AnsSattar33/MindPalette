"use client"
import React from 'react'

import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import UploadDropzone from '@/components/UploadDropzone'

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
    ssr: false,
})

const CreatePost = () => {

    const [editorContent, setEditorContent] = React.useState<string>('')
    const [uploadedImage, setUploadedImage] = React.useState<File | null>(null)
    const [tags, setTags] = React.useState<string>('')
    const [imageUrl, setImageUrl] = React.useState<string | null>(null)

    const handleImage = async () => {
        console.log('uploadedImage', uploadedImage)
        if (!uploadedImage) return;

        const formData = new FormData();
        formData.append('file', uploadedImage);

        const res = await fetch('/api/imageupload', {
            method: 'POST',
            body: formData
        })

        const data = await res.json();
        console.log('data', data)
        return data;
    }

    const HandleSavePost = async () => {
        console.log('editorContent', editorContent)
        console.log('uploadedImage', uploadedImage)

        const imageData = await handleImage();
        setImageUrl(imageData.secure_url);


        const res = await fetch('/api/dashboard/posts/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                title: "Test Post",
                content: editorContent,
                image: imageData.secure_url,
                tags: tags.split(',').map(tag => tag.trim()),
                published: true
            })
        })
        const data = await res.json();
        console.log('data', data)
    }

    console.log('editorContent', editorContent)

    return (
        <div>
            <div>
                <Input placeholder="Post Title" className='mb-4' />
                <Input placeholder="Post Description" className='mb-4' />
            </div>
            <div>

            </div>
            <div>
                <UploadDropzone imageUrl={imageUrl} setUploadedImage={setUploadedImage} />
            </div>
            <div>
                <RichTextEditor value={editorContent} onChange={setEditorContent} />
            </div>
            <div>
                <Input placeholder="Tags (comma separated)" className='mb-4' value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
            <div>
                <Button onClick={HandleSavePost}>Submit</Button>
            </div>
        </div>
    )
}

export default CreatePost