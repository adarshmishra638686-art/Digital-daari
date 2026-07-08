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
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

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
    if (!file) return;

    try {
      let imageSrc = "";
      if (onImageUpload) {
        imageSrc = await onImageUpload(file);
      } else {
        imageSrc = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ""));
          reader.onerror = () => reject(new Error("Failed to read image file"));
          reader.readAsDataURL(file);
        });
      }

      if (imageSrc) {
        editor.chain().focus().setImage({ src: imageSrc }).run();
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      e.target.value = "";
    }
  };

  const handleAddImageByUrl = () => {
    const normalized = imageUrl.trim();
    if (!normalized) return;

    editor.chain().focus().setImage({ src: normalized }).run();
    setImageUrl("");
    setShowImageInput(false);
  };

  const toolbarButtonClass =
    "border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white";
  const toolbarButtonActiveClass =
    "border-cyan-400/60 bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/30";

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-slate-900 border-b border-slate-700 p-3 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? toolbarButtonActiveClass : toolbarButtonClass}
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </Button>

        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? toolbarButtonActiveClass : toolbarButtonClass}
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </Button>

        <div className="w-px bg-slate-700 mx-1" />

        {/* Headings */}
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? toolbarButtonActiveClass : toolbarButtonClass}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </Button>

        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive("heading", { level: 3 }) ? toolbarButtonActiveClass : toolbarButtonClass}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </Button>

        <div className="w-px bg-slate-700 mx-1" />

        {/* Lists */}
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? toolbarButtonActiveClass : toolbarButtonClass}
          title="Bullet List"
        >
          <List size={16} />
        </Button>

        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? toolbarButtonActiveClass : toolbarButtonClass}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </Button>

        <div className="w-px bg-slate-700 mx-1" />

        {/* Code & Quote */}
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? toolbarButtonActiveClass : toolbarButtonClass}
          title="Code Block"
        >
          <Code size={16} />
        </Button>

        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? toolbarButtonActiveClass : toolbarButtonClass}
          title="Quote"
        >
          <Quote size={16} />
        </Button>

        <div className="w-px bg-slate-700 mx-1" />

        {/* Link */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={editor.isActive("link") ? toolbarButtonActiveClass : toolbarButtonClass}
            title="Add Link"
          >
            <LinkIcon size={16} />
          </Button>

          {showLinkInput && (
            <div className="absolute top-full left-0 mt-2 w-56 rounded-lg border border-slate-600 bg-slate-950 p-3 shadow-2xl z-50">
              <Input
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddLink();
                  if (e.key === "Escape") setShowLinkInput(false);
                }}
                autoFocus
                className="mb-2 h-9 border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-400 text-sm"
              />
              <div className="flex gap-2">
                <Button size="sm" type="button" onClick={handleAddLink} className="flex-1 bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => setShowLinkInput(false)}
                  className="flex-1 border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Image */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            type="button"
            title="Embed image by URL"
            onClick={() => setShowImageInput(!showImageInput)}
            className={toolbarButtonClass}
          >
            <ImageIcon size={16} />
          </Button>

          {showImageInput && (
            <div className="absolute top-full left-0 mt-2 w-64 rounded-lg border border-slate-600 bg-slate-950 p-3 shadow-2xl z-50">
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddImageByUrl();
                  if (e.key === "Escape") setShowImageInput(false);
                }}
                autoFocus
                className="mb-2 h-9 border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-400 text-sm"
              />
              <div className="flex gap-2">
                <Button size="sm" type="button" onClick={handleAddImageByUrl} className="flex-1 bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                  Embed
                </Button>
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => setShowImageInput(false)}
                  className="flex-1 border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <label className="cursor-pointer">
          <Button variant="outline" size="sm" type="button" asChild title="Upload Image" className={toolbarButtonClass}>
            <span>Upload</span>
          </Button>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        <div className="w-px bg-slate-700 mx-1" />

        {/* Undo/Redo */}
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={toolbarButtonClass}
          title="Undo"
        >
          <Undo2 size={16} />
        </Button>

        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={toolbarButtonClass}
          title="Redo"
        >
          <Redo2 size={16} />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        data-placeholder={placeholder}
        className="prose prose-sm max-w-none p-4 min-h-96 text-slate-900 bg-white focus:outline-none"
      />
    </div>
  );
}
