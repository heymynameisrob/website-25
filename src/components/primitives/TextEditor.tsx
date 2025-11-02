import * as React from "react";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";

type ContentType = string | JSONContent;

interface TextEditorProps {
  content?: ContentType;
  onContentChange?: (content: JSONContent) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

export function TextEditor({
  content,
  onContentChange,
  placeholder = "Start typing...",
  className,
  editable = true,
}: TextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onContentChange?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none",
          "prose-headings:font-semibold prose-headings:text-primary",
          "prose-p:text-primary prose-p:leading-7",
          "prose-a:text-accent prose-a:no-underline hover:prose-a:underline",
          "prose-strong:text-primary prose-strong:font-semibold",
          "prose-code:text-accent prose-code:bg-gray-3 prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
          "prose-pre:bg-gray-3 prose-pre:text-primary",
          "prose-ul:list-disc prose-ul:pl-4",
          "prose-ol:list-decimal prose-ol:pl-4",
          "prose-li:text-primary",
          "prose-blockquote:border-l-4 prose-blockquote:border-gray-6 prose-blockquote:pl-4 prose-blockquote:italic",
          className,
        ),
      },
    },
  });

  // Update editor content when prop changes
  React.useEffect(() => {
    if (!editor || !content) return;

    // Check if content has actually changed to avoid unnecessary updates
    const currentContent =
      typeof content === "string" ? editor.getHTML() : editor.getJSON();

    const hasChanged =
      typeof content === "string"
        ? currentContent !== content
        : JSON.stringify(currentContent) !== JSON.stringify(content);

    if (hasChanged) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  // Update editable state when prop changes
  React.useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full">
      <EditorContent editor={editor} />
    </div>
  );
}
