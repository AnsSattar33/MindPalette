"use client";
import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import CodeBlock from "@tiptap/extension-code-block";
import Code from "@tiptap/extension-code";
import Link from "@tiptap/extension-link";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import HardBreak from "@tiptap/extension-hard-break";
import Image from "@tiptap/extension-image";

import {
    Bold as BoldIcon,
    Italic as ItalicIcon,
    Underline as UnderlineIcon,
    Strikethrough as StrikeIcon,
    Quote,
    List as ListIcon,
    ListOrdered,
    Code2,
    Link as LinkIcon,
    Minus,
    Image as ImageIcon,
    Heading1,
    Heading2,
    Heading3,
    Undo,
    Redo,
} from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {



    const editor = useEditor({
        extensions: [
            StarterKit.configure({ codeBlock: false }), // history already included
            Bold,
            Italic,
            Underline,
            Strike,
            Heading.configure({ levels: [1, 2, 3] }),
            Blockquote,
            BulletList,
            OrderedList,
            ListItem,
            CodeBlock,
            Code,
            Link,
            HorizontalRule,
            HardBreak,
            Image,
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) return null;

    const addLink = () => {
        const url = prompt("Enter URL:");
        if (url) editor.chain().focus().setLink({ href: url }).run();
    };

    const addImage = () => {
        const url = prompt("Enter image URL:");
        if (url) editor.chain().focus().setImage({ src: url }).run();
    };

    return (
        <div className="w-full border rounded-md shadow-sm bg-card">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 border-b p-2 bg-muted/40">
                <button onClick={() => editor.chain().focus().undo().run()}>
                    <Undo className="w-4 h-4" />
                </button>
                <button onClick={() => editor.chain().focus().redo().run()}>
                    <Redo className="w-4 h-4" />
                </button>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                    <Heading1 className="w-4 h-4" />
                </button>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                    <Heading2 className="w-4 h-4" />
                </button>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                    <Heading3 className="w-4 h-4" />
                </button>
                <button onClick={() => editor.chain().focus().toggleBold().run()}>
                    <BoldIcon className="w-4 h-4" />
                </button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()}>
                    <ItalicIcon className="w-4 h-4" />
                </button>
                <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
                    <UnderlineIcon className="w-4 h-4" />
                </button>
                <button onClick={() => editor.chain().focus().toggleStrike().run()}>
                    <StrikeIcon className="w-4 h-4" />
                </button>
                <button onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                    <Quote className="w-4 h-4" />
                </button>
                <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
                    <ListIcon className="w-4 h-4" />
                </button>
                <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                    <ListOrdered className="w-4 h-4" />
                </button>
                <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
                    <Code2 className="w-4 h-4" />
                </button>
                <button onClick={addLink}>
                    <LinkIcon className="w-4 h-4" />
                </button>
                <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                    <Minus className="w-4 h-4" />
                </button>
                <button onClick={addImage}>
                    <ImageIcon className="w-4 h-4" />
                </button>
            </div>

            {/* Editor Content */}
            <div className="p-3 min-h-[200px] prose dark:prose-invert max-w-none">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
