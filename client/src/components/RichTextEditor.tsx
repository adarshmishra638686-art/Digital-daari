import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";

const lowlight = createLowlight();
lowlight.register("js", js);
lowlight.register("ts", ts);
lowlight.register("python", python);
lowlight.register("bash", bash);
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  Undo2,
  Redo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import "./RichTextEditor.css";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your blog post here...",
  onImageUpload,
}: RichTextEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({
        allowBase64: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const handleAddLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      try {
        const url = await onImageUpload(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
  };

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-3 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-slate-200" : ""}
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-slate-200" : ""}
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </Button>

        <div className="w-px bg-slate-300 mx-1" />

        {/* Headings */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "bg-slate-200" : ""}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive("heading", { level: 3 }) ? "bg-slate-200" : ""}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </Button>

        <div className="w-px bg-slate-300 mx-1" />

        {/* Lists */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-slate-200" : ""}
          title="Bullet List"
        >
          <List size={16} />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-slate-200" : ""}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </Button>

        <div className="w-px bg-slate-300 mx-1" />

        {/* Code & Quote */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "bg-slate-200" : ""}
          title="Code Block"
        >
          <Code size={16} />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "bg-slate-200" : ""}
          title="Quote"
        >
          <Quote size={16} />
        </Button>

        <div className="w-px bg-slate-300 mx-1" />

        {/* Link */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={editor.isActive("link") ? "bg-slate-200" : ""}
            title="Add Link"
          >
            <LinkIcon size={16} />
          </Button>

          {showLinkInput && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg p-2 shadow-lg z-10 w-48">
              <Input
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddLink();
                  if (e.key === "Escape") setShowLinkInput(false);
                }}
                className="mb-2 text-sm"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddLink} className="flex-1">
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowLinkInput(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Image */}
        <label className="cursor-pointer">
          <Button variant="outline" size="sm" asChild title="Add Image">
            <span>
              <ImageIcon size={16} />
            </span>
          </Button>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        <div className="w-px bg-slate-300 mx-1" />

        {/* Undo/Redo */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo2 size={16} />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo2 size={16} />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-96 focus:outline-none"
      />
    </div>
  );
}
