"use client";

import React, { useState, useRef, useEffect } from "react";

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

// Simple, performant client-side Markdown parser for preview rendering
export function parseMarkdownToHtml(markdown: string): string {
  if (!markdown) return "";
  // Normalize Windows CRLF and Mac CR newlines to standard LF to ensure regex block splitting works
  let html = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Escape HTML entities to prevent raw injection
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Blockquotes
  html = html.replace(/^\>\s+(.+)$/gm, "<blockquote>$1</blockquote>");

  // Code Blocks
  html = html.replace(/```([\s\S]*?)```/gm, (match, p1) => {
    return `<pre><code>${p1.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Headers
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Bullet Lists
  html = html.replace(/^[\*\-]\s+(.+)$/gm, "<li class='bullet'>$1</li>");
  html = html.replace(/(<li class='bullet'>.*<\/li>\s*)+/g, (match) => `<ul>\n${match}</ul>\n`);

  // Numbered Lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, "<li class='number'>$1</li>");
  html = html.replace(/(<li class='number'>.*<\/li>\s*)+/g, (match) => `<ol>\n${match}</ol>\n`);

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="preview-img" />');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/_([^_]+)_/g, "<em>$1</em>");

  // Paragraphs (split by at least two newlines, tolerant of ANY whitespace in between)
  const blocks = html.split(/\n\s*\n+/);
  const formattedBlocks = blocks.map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return "";
    // If it's already an HTML block tag, don't wrap in <p>
    if (
      trimmed.startsWith("<h") ||
      trimmed.startsWith("<ul") ||
      trimmed.startsWith("<ol") ||
      trimmed.startsWith("<pre") ||
      trimmed.startsWith("<block") ||
      trimmed.startsWith("<img")
    ) {
      return trimmed;
    }
    return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
  });

  return formattedBlocks.join("\n");
}

export default function MarkdownEditor({ value, onChange, placeholder = "Write in Markdown...", onImageUpload }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "split">("split");
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set split mode default based on width
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        if (window.innerWidth < 1024) {
          setActiveTab("edit");
        } else {
          setActiveTab("split");
        }
      };
      handleResize(); // Call initially
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + selected + after;

    onChange(text.substring(0, start) + replacement + text.substring(end));

    // Refocus and select
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const handleImageUploadClick = () => {
    if (onImageUpload && fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      insertText("![Alt text](", ")");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onImageUpload) {
      const file = e.target.files[0];
      setUploading(true);
      try {
        const url = await onImageUpload(file);
        insertText(`![${file.name}](${url})\n`);
      } catch (err) {
        alert("Failed to upload image.");
        console.error(err);
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  const toolbarActions = [
    { label: "B", tooltip: "Bold", action: () => insertText("**", "**") },
    { label: "I", tooltip: "Italic", action: () => insertText("*", "*") },
    { label: "H1", tooltip: "Heading 1", action: () => insertText("# ", "") },
    { label: "H2", tooltip: "Heading 2", action: () => insertText("## ", "") },
    { label: "Quote", tooltip: "Quote", action: () => insertText("> ", "") },
    { label: "Code", tooltip: "Code Block", action: () => insertText("```\n", "\n```") },
    { label: "List", tooltip: "Bullet List", action: () => insertText("- ", "") },
    { label: "Num", tooltip: "Numbered List", action: () => insertText("1. ", "") },
    { label: "Link", tooltip: "Hyperlink", action: () => insertText("[", "](url)") },
    { label: uploading ? "..." : "Img", tooltip: "Upload Image", action: handleImageUploadClick },
  ];

  return (
    <div className="md-editor-container">
      {/* Hidden File Input for inline images */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />

      {/* Toolbar & Tabs Header */}
      <div className="md-editor-header">
        <div className="md-toolbar">
          {toolbarActions.map((btn, i) => (
            <button
              key={i}
              type="button"
              className="md-tool-btn"
              onClick={btn.action}
              title={btn.tooltip}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="md-tabs">
          <button
            type="button"
            className={`md-tab-btn ${activeTab === "edit" ? "active" : ""}`}
            onClick={() => setActiveTab("edit")}
          >
            Editor
          </button>
          <button
            type="button"
            className={`md-tab-btn ${activeTab === "preview" ? "active" : ""}`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
          <button
            type="button"
            className={`md-tab-btn hidden-lg-down ${activeTab === "split" ? "active" : ""}`}
            onClick={() => setActiveTab("split")}
          >
            Split View
          </button>
        </div>
      </div>

      {/* Editor & Preview Workspace */}
      <div className={`md-workspace ${activeTab}`}>
        {(activeTab === "edit" || activeTab === "split") && (
          <div className="md-edit-pane">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="md-textarea"
            />
          </div>
        )}

        {(activeTab === "preview" || activeTab === "split") && (
          <div className="md-preview-pane blog-details-content">
            {value ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: parseMarkdownToHtml(value),
                }}
              />
            ) : (
              <p className="md-preview-empty">Live preview will render here...</p>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        .md-editor-container {
          border: 1px solid var(--border);
          border-radius: 12px;
          background: rgba(11, 14, 28, 0.6);
          backdrop-filter: blur(16px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 480px;
        }
        .md-editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border-bottom: 1px solid var(--border);
          background: rgba(15, 23, 42, 0.8);
          flex-wrap: wrap;
          gap: 8px;
        }
        .md-toolbar {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .md-tool-btn {
          background: transparent;
          border: 1px solid transparent;
          color: var(--fg-muted);
          padding: 4px 10px;
          border-radius: 6px;
          font-family: var(--font-mono), monospace;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .md-tool-btn:hover {
          background: var(--border);
          color: var(--primary);
          border-color: rgba(99, 102, 241, 0.4);
        }
        .md-tabs {
          display: flex;
          background: rgba(0, 0, 0, 0.3);
          padding: 2px;
          border-radius: 8px;
          border: 1px solid var(--border);
        }
        .md-tab-btn {
          background: transparent;
          border: none;
          color: var(--fg-dim);
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .md-tab-btn:hover {
          color: var(--fg-muted);
        }
        .md-tab-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.4);
        }
        .md-workspace {
          display: grid;
          flex-grow: 1;
          min-height: 400px;
          background: rgba(0, 0, 0, 0.2);
        }
        .md-workspace.edit {
          grid-template-columns: 1fr;
        }
        .md-workspace.preview {
          grid-template-columns: 1fr;
        }
        .md-workspace.split {
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }
        .md-edit-pane {
          border-right: 1px solid var(--border);
          display: flex;
        }
        .md-workspace.edit .md-edit-pane {
          border-right: none;
        }
        .md-textarea {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: var(--fg-muted);
          font-family: var(--font-mono), monospace;
          font-size: 14px;
          line-height: 1.6;
          padding: 16px;
          resize: vertical;
          min-height: 400px;
        }
        .md-preview-pane {
          padding: 16px 24px;
          overflow-y: auto;
          max-height: 500px;
          background: rgba(15, 23, 42, 0.2);
          color: var(--fg-muted);
          font-size: 16px;
          line-height: 1.8;
        }
        .md-preview-pane p {
          margin-bottom: 24px;
        }
        .md-preview-pane h1,
        .md-preview-pane h2,
        .md-preview-pane h3 {
          color: white;
          font-weight: 700;
          line-height: 1.3;
          margin-top: 32px;
          margin-bottom: 16px;
        }
        .md-preview-pane h1 { font-size: 28px; }
        .md-preview-pane h2 { font-size: 22px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
        .md-preview-pane h3 { font-size: 18px; }
        .md-preview-pane ul,
        .md-preview-pane ol {
          margin-bottom: 24px;
          padding-left: 24px;
        }
        .md-preview-pane li {
          margin-bottom: 8px;
        }
        .md-preview-pane blockquote {
          border-left: 3px solid var(--primary);
          background: rgba(99, 102, 241, 0.05);
          padding: 16px 20px;
          border-radius: 0 8px 8px 0;
          margin: 24px 0;
          font-style: italic;
        }
        .md-preview-empty {
          color: var(--fg-dim);
          font-style: italic;
          text-align: center;
          margin-top: 100px;
        }
        .preview-img {
          max-width: 100%;
          border-radius: 8px;
          margin: 24px 0;
          border: 1px solid var(--border);
        }
        @media (max-width: 1023px) {
          .hidden-lg-down {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
