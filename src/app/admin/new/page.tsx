"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { blogService } from "@/lib/blogService";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

export default function NewBlogPage() {
  const router = useRouter();
  
  // Guard check state
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Agentic AI");
  const [tags, setTags] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [readTime, setReadTime] = useState("5 min read");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  
  // SEO Meta
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  // Featured Image support
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Action status
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Autosave State
  const [draftId, setDraftId] = useState<string | null>(null);
  const [autosaveStatus, setAutosaveStatus] = useState<string>("");

  // Verify auth session on load
  useEffect(() => {
    async function verifyAuth() {
      const user = await blogService.getCurrentUser();
      if (!user) {
        router.push("/admin");
      } else {
        setAuthorName(user.email === "admin@aikafanda.com" ? "Hassan A." : user.email.split("@")[0]);
        setCheckingAuth(false);
      }
    }
    verifyAuth();
  }, [router]);

  // Autosave Draft logic
  useEffect(() => {
    if (checkingAuth || saving) return;
    if (!title && !content) return; // Don't autosave completely empty forms

    const timer = setTimeout(async () => {
      setAutosaveStatus("Saving draft...");
      try {
        const payload = {
          title: title || "Untitled Draft",
          slug: slug || `untitled-draft-${Date.now()}`,
          excerpt: excerpt.trim() || title || "Draft",
          content,
          featured_image: imageUrl || "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop",
          category,
          tags,
          author_name: authorName || "Hassan A.",
          status: "draft" as const,
          read_time: readTime,
          meta_title: metaTitle || title,
          meta_description: metaDescription || excerpt || title,
        };

        if (draftId) {
          await blogService.updateBlog(draftId, payload);
          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setAutosaveStatus(`Draft saved at ${time}`);
        } else {
          // Check slug uniqueness before creating
          const existing = await blogService.getBlogBySlug(payload.slug);
          if (!existing) {
             const newDraft = await blogService.createBlog(payload);
             if (newDraft) {
               setDraftId(newDraft.id);
               const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
               setAutosaveStatus(`Draft saved at ${time}`);
               // Update URL to edit route so refreshing doesn't create multiple drafts
               window.history.replaceState(null, "", `/admin/edit/${newDraft.id}`);
             }
          }
        }
      } catch (e) {
        setAutosaveStatus("Autosave failed");
        console.error("Autosave error", e);
      }
    }, 4000); // 4 seconds debounce

    return () => clearTimeout(timer);
  }, [title, slug, excerpt, content, imageUrl, category, tags, authorName, readTime, metaTitle, metaDescription, draftId, checkingAuth, saving]);

  // Handle Slugify title helper
  const handleTitleChange = (val: string) => {
    setTitle(val);
    // Slugify
    const slugified = val
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
    setSlug(slugified);
    
    // Default SEO meta title
    setMetaTitle(val);
  };

  // Image Upload helper
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        alert("Please upload image files only.");
        return;
      }
      setImageFile(file);
      setUploadingImage(true);
      setErrorMsg("");
      try {
        const publicUrl = await blogService.uploadFeaturedImage(file);
        setImageUrl(publicUrl);
      } catch (err: any) {
        setErrorMsg("Failed to upload image: " + err.message);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validate fields
    if (!title.trim()) {
      setErrorMsg("Title is required.");
      return;
    }
    if (!slug.trim()) {
      setErrorMsg("Slug is required.");
      return;
    }
    if (!content.trim()) {
      setErrorMsg("Blog text content is required.");
      return;
    }

    setSaving(true);
    try {
      // Check slug uniqueness
      const existing = await blogService.getBlogBySlug(slug);
      if (existing && existing.id !== draftId) {
        setErrorMsg("The slug is already taken. Please modify the slug to be unique.");
        setSaving(false);
        return;
      }

      const payload = {
        title,
        slug,
        excerpt: excerpt.trim() || title,
        content,
        featured_image: imageUrl || "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop",
        category,
        tags,
        author_name: authorName || "Hassan A.",
        status,
        read_time: readTime,
        meta_title: metaTitle || title,
        meta_description: metaDescription || excerpt || title,
      };

      let success = false;
      if (draftId) {
        const updated = await blogService.updateBlog(draftId, payload);
        success = !!updated;
      } else {
        const newBlog = await blogService.createBlog(payload);
        success = !!newBlog;
      }

      if (success) {
        router.push("/admin");
      } else {
        setErrorMsg("Failed to record new blog post in database.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while creating the blog post.");
    } finally {
      setSaving(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="new-blog-loading-sec">
        <div className="new-blog-spinner" />
        <p>Verifying Admin Gateway Session...</p>
        <style jsx>{`
          .new-blog-loading-sec {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #060813;
            color: var(--fg-dim);
            gap: 16px;
          }
          .new-blog-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(99, 102, 241, 0.1);
            border-radius: 50%;
            border-top-color: var(--primary);
            animation: spin 1s ease-in-out infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <main className="new-blog-wrapper">
      <div className="new-blog-glow bg-1" />
      <div className="new-blog-glow bg-2" />

      <section className="container new-blog-container">
        {/* Breadcrumb Header */}
        <div className="new-blog-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
          <div>
            <Link href="/admin" className="back-link">
              ← Back to CMS Table
            </Link>
            <h1 className="form-page-title">Draft New Insight</h1>
            <p className="form-page-subtitle">Publish fresh research or tech playbooks to the public audience</p>
          </div>
          {autosaveStatus && (
            <div className="autosave-status">
              <span className="autosave-dot"></span>
              {autosaveStatus}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="new-blog-form">
          {errorMsg && <div className="form-error-banner">{errorMsg}</div>}

          {/* Grid fields */}
          <div className="form-fields-grid glass">
            {/* Column 1 */}
            <div className="grid-col">
              <div className="form-group">
                <label htmlFor="title">Blog Title *</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Scaling n8n Workflows in Enterprise Contexts"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="slug">Dynamic URL Slug *</label>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="scaling-n8n-workflows-enterprise"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="excerpt">Excerpt Description (Cards Preview) *</label>
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Enter a brief 1-2 sentence preview summary shown on the blog cards page."
                  rows={3}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="category">Category</label>
                  <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Agentic AI">Agentic AI</option>
                    <option value="Vibe Coding">Vibe Coding</option>
                    <option value="Workflow Automation">Workflow Automation</option>
                    <option value="Engineering insights">Engineering insights</option>
                    <option value="Company Updates">Company Updates</option>
                  </select>
                </div>

                <div className="form-group half">
                  <label htmlFor="readTime">Read Time</label>
                  <input
                    type="text"
                    id="readTime"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="e.g. 5 min read"
                  />
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="grid-col">
              {/* Image Input Options */}
              <div className="form-group">
                <label>Featured Cover Image</label>
                <div className="image-input-box">
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      id="imageFile"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden-file-input"
                    />
                    <label htmlFor="imageFile" className="file-upload-trigger">
                      {uploadingImage ? "Uploading Cover..." : "Select Cover File"}
                    </label>
                  </div>
                  <span className="or-divider">OR</span>
                  <input
                    type="text"
                    placeholder="Paste direct Unsplash/Image URL..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="image-url-input"
                  />
                </div>
                {imageUrl && (
                  <div className="image-preview-preview-wrapper border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Cover Preview" className="cover-img-thumbnail" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="tags">Tags (Comma-separated list)</label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="temporal, crewai, automation, scale"
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="authorName">Author Name</label>
                  <input
                    type="text"
                    id="authorName"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Hassan A."
                  />
                </div>

                <div className="form-group half">
                  <label htmlFor="status">Publish State</label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                  >
                    <option value="draft">Save as Draft (Private)</option>
                    <option value="published">Publish (Publicly Visible)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Content Markdown Editor */}
          <div className="form-editor-container-box mt-4">
            <h3 className="section-subtitle">Markdown Content Editor *</h3>
            <MarkdownEditor 
              value={content} 
              onChange={setContent} 
              onImageUpload={blogService.uploadFeaturedImage}
            />
          </div>

          {/* SEO Meta Information */}
          <div className="form-seo-section glass mt-4">
            <h3>SEO Search Engine Optimization</h3>
            <p>Define custom search tags to increase index readability and organic ranking</p>
            
            <div className="form-group">
              <label htmlFor="metaTitle">SEO Meta Title (Title Tag)</label>
              <input
                type="text"
                id="metaTitle"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Custom metadata index title tag..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="metaDescription">
                SEO Meta Description (Meta Snippet Description)
                <span className={`char-counter ${metaDescription.length > 160 ? "warning" : "ok"}`}>
                  {metaDescription.length}/160 chars recommended
                </span>
              </label>
              <textarea
                id="metaDescription"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Google index descriptor text..."
                rows={3}
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="form-action-row">
            <button
              type="submit"
              className="btn btn-primary submit-btn"
              disabled={saving || uploadingImage}
            >
              {saving ? "Storing Record..." : status === "published" ? "Publish Live" : "Save Draft"}
            </button>
            <Link href="/admin" className="btn btn-secondary cancel-btn">
              Cancel Draft
            </Link>
          </div>
        </form>
      </section>

      <style jsx global>{`
        .new-blog-wrapper {
          position: relative;
          padding-top: 140px;
          padding-bottom: 120px;
          background: #060813;
          min-height: 100vh;
          overflow: hidden;
        }
        .new-blog-glow {
          position: absolute;
          width: 40vw;
          height: 40vw;
          border-radius: 50%;
          filter: blur(140px);
          pointer-events: none;
          opacity: 0.1;
          z-index: 0;
        }
        .new-blog-glow.bg-1 {
          background: var(--primary);
          top: -5%;
          left: -5%;
        }
        .new-blog-glow.bg-2 {
          background: var(--accent);
          bottom: -5%;
          right: -5%;
        }
        .new-blog-container {
          position: relative;
          z-index: 1;
        }
        .autosave-status {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid var(--border);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-family: var(--font-mono), monospace;
          color: var(--fg-muted);
        }
        .autosave-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          color: var(--fg-dim);
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
        }
        .back-link:hover {
          color: var(--primary);
        }
        .form-page-title {
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
        }
        .form-page-subtitle {
          font-size: 14px;
          color: var(--fg-muted);
        }
        .new-blog-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .form-error-banner {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 14px;
          border-radius: 10px;
          font-size: 14px;
          text-align: left;
          line-height: 1.4;
        }
        .form-fields-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          padding: 32px;
          border-radius: 16px;
          text-align: left;
        }
        .grid-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-row {
          display: flex;
          gap: 16px;
        }
        .half {
          flex: 1;
        }
        .form-group label {
          font-size: 13px;
          font-weight: 500;
          color: var(--fg-muted);
          margin-bottom: 6px;
          display: block;
        }
        .form-group input,
        .form-group select,
        .form-group textarea,
        .form-seo-section input,
        .form-seo-section textarea {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: white;
          padding: 10px 14px;
          font-size: 14px;
          outline: none;
          width: 100%;
          transition: all 0.2s ease;
        }
        .form-group textarea {
          resize: vertical;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus,
        .form-seo-section input:focus,
        .form-seo-section textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.15);
        }

        /* Image Picker Option styling */
        .image-input-box {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .file-input-wrapper {
          position: relative;
        }
        .hidden-file-input {
          position: absolute;
          width: 0;
          height: 0;
          opacity: 0;
        }
        .file-upload-trigger {
          display: inline-block;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 600;
          color: var(--fg-muted);
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .file-upload-trigger:hover {
          background: var(--border);
          color: white;
        }
        .or-divider {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          color: var(--fg-dim);
        }
        .image-url-input {
          flex-grow: 1;
        }
        .image-preview-preview-wrapper {
          margin-top: 12px;
          border-radius: 8px;
          overflow: hidden;
          width: fit-content;
          max-width: 180px;
          aspect-ratio: 16 / 9;
        }
        .cover-img-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Editor Section Box */
        .form-editor-container-box {
          text-align: left;
        }
        .section-subtitle {
          font-size: 18px;
          font-weight: 700;
          color: white;
          margin-bottom: 12px;
        }

        /* SEO Section Box */
        .form-seo-section {
          padding: 32px;
          border-radius: 16px;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-seo-section h3 {
          font-size: 18px;
          font-weight: 700;
          color: white;
        }
        .form-seo-section p {
          font-size: 13px;
          color: var(--fg-muted);
          margin-top: -12px;
        }
        .char-counter {
          float: right;
          font-size: 11px;
          font-family: var(--font-mono), monospace;
        }
        .char-counter.ok { color: #10b981; }
        .char-counter.warning { color: #f59e0b; }

        /* Action Row buttons styling */
        .form-action-row {
          display: flex;
          gap: 16px;
          margin-top: 12px;
        }
        .submit-btn {
          padding: 12px 32px;
        }
        .cancel-btn {
          border-color: rgba(239, 68, 68, 0.2) !important;
          color: #ef4444 !important;
          padding: 12px 32px;
        }
        .cancel-btn:hover {
          background: rgba(239, 68, 68, 0.08) !important;
        }

        /* Responsive Grid Form */
        @media (max-width: 768px) {
          .new-blog-wrapper {
            padding-top: 100px;
            padding-bottom: 80px;
          }
          .form-fields-grid {
            grid-template-columns: 1fr;
            padding: 20px;
            gap: 20px;
          }
          .form-seo-section {
            padding: 20px;
          }
          .image-input-box {
            flex-direction: column;
            align-items: stretch;
          }
          .file-upload-trigger {
            width: 100%;
            text-align: center;
          }
          .form-action-row {
            flex-direction: column;
          }
          .form-action-row .btn {
            width: 100%;
            text-align: center;
            justify-content: center;
          }
        }
      `}</style>
    </main>
  );
}
