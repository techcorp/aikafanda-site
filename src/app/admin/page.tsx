"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { blogService, Blog } from "@/lib/blogService";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function AdminPage() {
  const router = useRouter();
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Blogs state
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  // Filter/Sort State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState("newest");

  // Check login session initially
  useEffect(() => {
    async function checkSession() {
      try {
        const user = await blogService.getCurrentUser();
        if (user) {
          setIsAuthenticated(true);
          fetchBlogs();
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkSession();
  }, []);

  // Fetch all blogs (drafts + published) for Admin panel
  async function fetchBlogs() {
    setLoadingBlogs(true);
    try {
      const all = await blogService.getAllBlogs();
      setBlogs(all);
      
      // Extract unique categories for filter
      const uniqueCats = Array.from(new Set(all.map((b) => b.category).filter(Boolean)));
      setCategories(uniqueCats);
    } catch (err) {
      console.error("Failed to fetch all blogs:", err);
    } finally {
      setLoadingBlogs(false);
    }
  }

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoggingIn(true);
    try {
      const success = await blogService.login(email, password);
      if (success) {
        setIsAuthenticated(true);
        fetchBlogs();
      } else {
        setAuthError(
          isSupabaseConfigured()
            ? "Invalid login credentials. Please check your Supabase Auth credentials."
            : "Invalid credentials. Use 'admin@aikafanda.com' and 'admin123' for mock mode."
        );
      }
    } catch (err: any) {
      setAuthError(err.message || "An unexpected error occurred during login.");
    } finally {
      setLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await blogService.logout();
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
  };

  // Quick Publish/Unpublish Toggle
  const togglePublishStatus = async (blog: Blog) => {
    const nextStatus = blog.status === "published" ? "draft" : "published";
    try {
      const updated = await blogService.updateBlog(blog.id, { status: nextStatus });
      if (updated) {
        setBlogs((prev) => prev.map((b) => (b.id === blog.id ? updated : b)));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update publish status.");
    }
  };

  // Delete Blog
  const handleDeleteBlog = async (id: string, title: string) => {
    if (!confirm(`Are you absolutely sure you want to delete "${title}"?`)) return;
    try {
      const success = await blogService.deleteBlog(id);
      if (success) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
      } else {
        alert("Delete failed.");
      }
    } catch (err) {
      console.error("Failed to delete blog:", err);
      alert("An error occurred during deletion.");
    }
  };

  // Filter & Sort computation
  useEffect(() => {
    let result = [...blogs];

    // Search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.excerpt.toLowerCase().includes(query) ||
          b.content.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter((b) => b.category === categoryFilter);
    }

    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredBlogs(result);
  }, [blogs, search, statusFilter, categoryFilter, sortOrder]);

  if (checkingAuth) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-spinner" />
        <p>Loading Secure Gateway...</p>
        <style jsx>{`
          .admin-loading-screen {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #060813;
            color: var(--fg-dim);
            gap: 16px;
          }
          .admin-spinner {
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
    <main className="admin-page-wrapper">
      <div className="admin-glow bg-1" />
      <div className="admin-glow bg-2" />

      {/* CASE 1: RENDER LOGIN CARD */}
      {!isAuthenticated ? (
        <section className="container admin-login-section">
          <div className="login-card glass">
            <div className="login-header">
              <span className="secure-badge">ADMIN ACCESS</span>
              <h1>Ai Ka Fanda CMS</h1>
              <p>Sign in to create, edit, and publish blogs to the website.</p>
            </div>

            {/* Mode Banner Indicator */}
            <div className={`db-mode-indicator ${isSupabaseConfigured() ? "supabase" : "local"}`}>
              {isSupabaseConfigured() ? (
                <span>⚡ Live Mode: Connected to Supabase</span>
              ) : (
                <div className="mock-banner-info">
                  <span>💡 Offline Demo Mode (localStorage)</span>
                  <p>Credentials: <strong>admin@aikafanda.com</strong> / <strong>admin123</strong></p>
                </div>
              )}
            </div>

            <form onSubmit={handleLogin} className="login-form">
              {authError && <div className="auth-error-box">{authError}</div>}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary login-submit-btn" disabled={loggingIn}>
                {loggingIn ? "Verifying..." : "Authorize Login"}
              </button>
            </form>
          </div>
        </section>
      ) : (
        /* CASE 2: RENDER DASHBOARD CMS PORTAL */
        <section className="container admin-dashboard-section">
          {/* Header Row */}
          <div className="dashboard-header-row">
            <div>
              <span className="cms-label">Control Panel</span>
              <h1 className="dashboard-title">Blog CMS Dashboard</h1>
              <p className="dashboard-subtitle">
                Manage your agency insights ({blogs.length} total posts)
              </p>
            </div>
            <div className="dashboard-actions">
              <Link href="/admin/new" className="btn btn-primary">
                + Create Blog
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary logout-btn">
                Logout
              </button>
            </div>
          </div>

          {/* Database mode notice bar */}
          <div className={`dashboard-mode-bar ${isSupabaseConfigured() ? "supabase" : "local"}`}>
            {isSupabaseConfigured()
              ? "⚡ Live Database Mode (Supabase PostgreSQL Client)"
              : "💡 Demo Mode active (Offline LocalStorage backed DB)"}
          </div>

          {/* Search, Filter, Sort Row */}
          <div className="cms-filters-card glass">
            <div className="filter-input-group search">
              <label>Search Posts</label>
              <input
                type="text"
                placeholder="Search by title or text content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-input-group">
              <label>Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="draft">Drafts Only</option>
                <option value="published">Published Only</option>
              </select>
            </div>

            <div className="filter-input-group">
              <label>Category</label>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-input-group">
              <label>Sort By</label>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Blogs List Container */}
          <div className="cms-table-container glass">
            {loadingBlogs ? (
              <div className="table-loader">
                <span className="spinner" />
                <p>Retrieving database contents...</p>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="table-empty">
                <p>No blog posts matched the selected search or filter criteria.</p>
              </div>
            ) : (
              <>
                {/* Desktop/Tablet Table view */}
                <table className="cms-desktop-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBlogs.map((b) => (
                      <tr key={b.id}>
                        <td>
                          <div className="table-title-cell">
                            <strong>{b.title}</strong>
                            <span>/{b.slug}</span>
                          </div>
                        </td>
                        <td>
                          <span className="table-cat-badge">{b.category || "Insight"}</span>
                        </td>
                        <td>
                          <button
                            onClick={() => togglePublishStatus(b)}
                            className={`status-toggle-pill ${b.status}`}
                            title="Click to toggle status"
                          >
                            {b.status}
                          </button>
                        </td>
                        <td>
                          <span className="table-date">
                            {new Date(b.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div className="table-action-buttons">
                            <Link href={`/admin/edit/${b.id}`} className="action-btn edit">
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteBlog(b.id, b.title)}
                              className="action-btn delete"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile Responsive Stacked Cards view */}
                <div className="cms-mobile-cards">
                  {filteredBlogs.map((b) => (
                    <div key={b.id} className="cms-mobile-card border">
                      <div className="mobile-card-header">
                        <h4>{b.title}</h4>
                        <span className="slug-line">/{b.slug}</span>
                      </div>
                      <div className="mobile-card-row">
                        <span className="label">Category:</span>
                        <span className="val">{b.category || "Insight"}</span>
                      </div>
                      <div className="mobile-card-row">
                        <span className="label">Status:</span>
                        <button
                          onClick={() => togglePublishStatus(b)}
                          className={`status-toggle-pill ${b.status}`}
                        >
                          {b.status}
                        </button>
                      </div>
                      <div className="mobile-card-row">
                        <span className="label">Created:</span>
                        <span className="val">{new Date(b.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="mobile-card-footer">
                        <Link href={`/admin/edit/${b.id}`} className="mobile-action-btn edit">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteBlog(b.id, b.title)}
                          className="mobile-action-btn delete"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <style jsx global>{`
        .admin-page-wrapper {
          position: relative;
          padding-top: 140px;
          padding-bottom: 120px;
          min-height: 100vh;
          background: #060813;
          overflow: hidden;
        }
        .admin-glow {
          position: absolute;
          width: 45vw;
          height: 45vw;
          border-radius: 50%;
          filter: blur(140px);
          pointer-events: none;
          opacity: 0.1;
          z-index: 0;
        }
        .admin-glow.bg-1 {
          background: var(--primary);
          top: -10%;
          left: -10%;
        }
        .admin-glow.bg-2 {
          background: var(--accent);
          bottom: -10%;
          right: -10%;
        }

        /* 1. Login Card Panel Styling */
        .admin-login-section {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
        }
        .login-card {
          width: 100%;
          max-width: 480px;
          border-radius: 20px;
          padding: 40px;
          text-align: left;
        }
        .login-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .secure-badge {
          display: inline-block;
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          color: var(--primary);
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          padding: 4px 10px;
          border-radius: 99px;
          letter-spacing: 0.15em;
          margin-bottom: 12px;
        }
        .login-header h1 {
          font-size: 28px;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
        }
        .login-header p {
          font-size: 14px;
          color: var(--fg-muted);
          line-height: 1.5;
        }
        .db-mode-indicator {
          border-radius: 10px;
          padding: 12px;
          font-size: 13px;
          margin-bottom: 24px;
          text-align: center;
          border: 1px solid transparent;
        }
        .db-mode-indicator.supabase {
          background: rgba(16, 185, 129, 0.05);
          border-color: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }
        .db-mode-indicator.local {
          background: rgba(245, 158, 11, 0.05);
          border-color: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }
        .mock-banner-info p {
          font-size: 11px;
          margin-top: 4px;
          color: var(--fg-dim);
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .auth-error-box {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 12px;
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.4;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 13px;
          font-weight: 500;
          color: var(--fg-muted);
        }
        .form-group input,
        .filter-input-group input,
        .filter-input-group select {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: white;
          padding: 10px 14px;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
        }
        .form-group input:focus,
        .filter-input-group input:focus,
        .filter-input-group select:focus {
          border-color: var(--primary);
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.15);
        }
        .login-submit-btn {
          width: 100%;
          justify-content: center;
          margin-top: 8px;
        }

        /* 2. Admin Dashboard Layout */
        .admin-dashboard-section {
          position: relative;
          z-index: 1;
        }
        .dashboard-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 20px;
          text-align: left;
        }
        .cms-label {
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          color: var(--primary);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .dashboard-title {
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 800;
          color: white;
          margin-top: 4px;
          margin-bottom: 6px;
        }
        .dashboard-subtitle {
          font-size: 14px;
          color: var(--fg-muted);
        }
        .dashboard-actions {
          display: flex;
          gap: 12px;
        }
        .logout-btn {
          border-color: rgba(239, 68, 68, 0.2) !important;
          color: #ef4444 !important;
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.08) !important;
        }
        .dashboard-mode-bar {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 24px;
          text-align: left;
          width: 100%;
        }
        .dashboard-mode-bar.supabase {
          background: rgba(16, 185, 129, 0.06);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .dashboard-mode-bar.local {
          background: rgba(245, 158, 11, 0.06);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        /* 3. Search & Filter Bar Card */
        .cms-filters-card {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 20px;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          text-align: left;
        }
        .filter-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .filter-input-group label {
          font-size: 12px;
          font-weight: 500;
          color: var(--fg-dim);
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        /* 4. Table Container CMS */
        .cms-table-container {
          border-radius: 16px;
          overflow: hidden;
          width: 100%;
        }
        .cms-desktop-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .cms-desktop-table th {
          background: rgba(15, 23, 42, 0.8);
          border-bottom: 1px solid var(--border);
          padding: 16px 24px;
          font-size: 12px;
          font-weight: 600;
          color: var(--fg-dim);
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .cms-desktop-table td {
          border-bottom: 1px solid var(--border);
          padding: 16px 24px;
          font-size: 14px;
          color: var(--fg-muted);
          vertical-align: middle;
        }
        .cms-desktop-table tr:last-child td {
          border-bottom: none;
        }
        .table-title-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .table-title-cell strong {
          color: white;
          font-size: 15px;
        }
        .table-title-cell span {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          color: var(--fg-dim);
        }
        .table-cat-badge {
          display: inline-block;
          font-size: 12px;
          color: var(--primary);
          background: rgba(99, 102, 241, 0.08);
          padding: 2px 10px;
          border-radius: 6px;
          border: 1px solid rgba(99, 102, 241, 0.15);
        }
        .status-toggle-pill {
          background: transparent;
          border: 1px solid transparent;
          border-radius: 99px;
          padding: 3px 12px;
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .status-toggle-pill.published {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }
        .status-toggle-pill.published:hover {
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
        .status-toggle-pill.draft {
          background: rgba(245, 158, 11, 0.08);
          border-color: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }
        .status-toggle-pill.draft:hover {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }
        .table-action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .action-btn {
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          padding: 4px 12px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .action-btn.edit {
          color: var(--primary);
        }
        .action-btn.edit:hover {
          background: rgba(99, 102, 241, 0.08);
          border-color: var(--primary);
        }
        .action-btn.delete {
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.15);
        }
        .action-btn.delete:hover {
          background: rgba(239, 68, 68, 0.08);
          border-color: #ef4444;
        }

        /* 5. Mobile Cards CMS List */
        .cms-mobile-cards {
          display: none;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
        }
        .cms-mobile-card {
          background: rgba(15, 23, 42, 0.4);
          border-radius: 12px;
          padding: 16px;
          text-align: left;
        }
        .mobile-card-header h4 {
          color: white;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .slug-line {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          color: var(--fg-dim);
          display: block;
          margin-bottom: 12px;
        }
        .mobile-card-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          margin-bottom: 8px;
        }
        .mobile-card-row .label {
          color: var(--fg-dim);
        }
        .mobile-card-row .val {
          color: var(--fg-muted);
          font-weight: 500;
        }
        .mobile-card-footer {
          border-top: 1px solid var(--border);
          margin-top: 16px;
          padding-top: 12px;
          display: flex;
          gap: 12px;
        }
        .mobile-action-btn {
          flex: 1;
          text-align: center;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid var(--border);
          background: transparent;
          cursor: pointer;
          text-decoration: none;
        }
        .mobile-action-btn.edit {
          color: var(--primary);
        }
        .mobile-action-btn.delete {
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.15);
        }

        /* Loading & Empty CMS States */
        .table-loader {
          padding: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .table-loader .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(99, 102, 241, 0.1);
          border-radius: 50%;
          border-top-color: var(--primary);
          animation: spin 1s ease-in-out infinite;
        }
        .table-empty {
          padding: 60px;
          text-align: center;
          color: var(--fg-dim);
        }

        /* 6. Media Queries admin panel */
        @media (max-width: 1024px) {
          .cms-filters-card {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }
        @media (max-width: 768px) {
          .admin-page-wrapper {
            padding-top: 100px;
            padding-bottom: 80px;
          }
          .dashboard-header-row {
            margin-bottom: 24px;
          }
          .cms-desktop-table {
            display: none;
          }
          .cms-mobile-cards {
            display: flex;
          }
          .cms-filters-card {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .dashboard-actions {
            width: 100%;
          }
          .dashboard-actions .btn {
            flex: 1;
            text-align: center;
            justify-content: center;
          }
        }
      `}</style>
    </main>
  );
}
