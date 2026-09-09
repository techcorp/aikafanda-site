"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// Ruya AI's Firebase project web API key — this is a public client identifier,
// not a secret (Firebase security is enforced by Auth/Firestore rules, not this key).
const FIREBASE_API_KEY = "AIzaSyBCzfFdC-TPVe7P07yXhTY5K7SGcR4zaso";
const RESET_PASSWORD_ENDPOINT = `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${FIREBASE_API_KEY}`;

type Status = "verifying" | "ready" | "invalid" | "unsupported" | "submitting" | "success";

function friendlyError(code?: string): string {
  switch (code) {
    case "EXPIRED_OOB_CODE":
      return "This reset link has expired. Please request a new one from the Ruya AI app.";
    case "INVALID_OOB_CODE":
      return "This reset link is invalid or has already been used.";
    case "USER_DISABLED":
      return "This account has been disabled.";
    case "WEAK_PASSWORD":
      return "Password should be at least 6 characters.";
    default:
      return "Something went wrong. Please request a new reset link from the Ruya AI app.";
  }
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rp-overlay">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .rp-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          overflow-y: auto;
          background: radial-gradient(circle at 50% 30%, #06241d 0%, #02201a 42%, #00110c 100%);
          color: #cae9de;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
        }
        .rp-card {
          width: 100%;
          max-width: 400px;
          background: #06241d;
          border: 1px solid rgba(163,194,184,0.15);
          border-radius: 24px;
          padding: 32px 28px;
          box-shadow: 0px 20px 60px -12px rgba(0,0,0,0.6);
        }
        .rp-emblem {
          width: 64px;
          height: 64px;
          margin: 0 auto 18px;
          border-radius: 9999px;
          background: #022019;
          border: 1px solid rgba(223,177,91,0.3);
          box-shadow: 0px 0px 40px 6px rgba(223,177,91,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }
        .rp-title {
          font-family: 'Noto Serif', serif;
          font-size: 24px;
          font-weight: 600;
          text-align: center;
          color: #fdcc73;
          margin: 0 0 4px;
        }
        .rp-subtitle {
          text-align: center;
          font-size: 13px;
          color: #aecdc3;
          margin: 0 0 24px;
        }
        .rp-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #d2c5b2;
          margin-bottom: 6px;
          padding: 0 2px;
        }
        .rp-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          border-radius: 12px;
          background: #022019;
          border: 1px solid rgba(163,194,184,0.2);
          margin-bottom: 16px;
          transition: border-color 0.2s;
        }
        .rp-input-wrap:focus-within {
          border-color: #dfb15b;
          box-shadow: 0 0 0 3px rgba(223,177,91,0.12);
        }
        .rp-input {
          width: 100%;
          background: transparent;
          border: 0;
          outline: none;
          color: #cae9de;
          font-size: 14px;
          padding: 13px 44px 13px 14px;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        .rp-input::placeholder { color: rgba(174,205,195,0.45); }
        .rp-eye {
          position: absolute;
          right: 6px;
          width: 32px;
          height: 32px;
          border: 0;
          background: transparent;
          color: #aecdc3;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          border-radius: 8px;
        }
        .rp-eye:hover { color: #fdcc73; }
        .rp-btn {
          width: 100%;
          height: 48px;
          border-radius: 9999px;
          border: 0;
          background: #dfb15b;
          color: #412d00;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: filter 0.15s, transform 0.15s;
        }
        .rp-btn:hover { filter: brightness(1.08); }
        .rp-btn:active { transform: scale(0.98); }
        .rp-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .rp-error {
          background: rgba(147,0,10,0.25);
          border: 1px solid rgba(255,180,171,0.35);
          color: #ffb4ab;
          font-size: 12px;
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 16px;
          line-height: 1.5;
        }
        .rp-success-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 16px;
          border-radius: 9999px;
          background: rgba(223,177,91,0.12);
          border: 1px solid rgba(223,177,91,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          color: #fdcc73;
        }
        .rp-center-text {
          text-align: center;
          font-size: 13px;
          color: #aecdc3;
          line-height: 1.6;
        }
        .rp-spinner {
          width: 32px;
          height: 32px;
          margin: 0 auto;
          border-radius: 9999px;
          border: 3px solid rgba(223,177,91,0.25);
          border-top-color: #dfb15b;
          animation: rp-spin 0.9s linear infinite;
        }
        @keyframes rp-spin { to { transform: rotate(360deg); } }
      `}</style>
      <div className="rp-card">{children}</div>
    </div>
  );
}

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  const [status, setStatus] = useState<Status>("verifying");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setStatus("invalid");
      setError("This link is missing required information. Please request a new one from the Ruya AI app.");
      return;
    }
    if (mode !== "resetPassword") {
      setStatus("unsupported");
      return;
    }

    fetch(RESET_PASSWORD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oobCode }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setError(friendlyError(data?.error?.message));
          setStatus("invalid");
          return;
        }
        setStatus("ready");
      })
      .catch(() => {
        setError("Network error. Please check your internet connection and try again.");
        setStatus("invalid");
      });
  }, [oobCode, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(RESET_PASSWORD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oobCode, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(friendlyError(data?.error?.message));
        setStatus("ready");
        return;
      }
      setStatus("success");
    } catch {
      setError("Network error. Please check your internet connection and try again.");
      setStatus("ready");
    }
  };

  if (status === "verifying") {
    return (
      <>
        <div className="rp-emblem">🌙</div>
        <h1 className="rp-title">Ruya AI</h1>
        <p className="rp-subtitle">Verifying your reset link&hellip;</p>
        <div className="rp-spinner" />
      </>
    );
  }

  if (status === "unsupported") {
    return (
      <>
        <div className="rp-emblem">🌙</div>
        <h1 className="rp-title">Ruya AI</h1>
        <p className="rp-center-text">
          This link isn&apos;t supported on this page. Please return to the Ruya AI app to continue.
        </p>
      </>
    );
  }

  if (status === "invalid") {
    return (
      <>
        <div className="rp-emblem">🌙</div>
        <h1 className="rp-title">Ruya AI</h1>
        <div className="rp-error">{error}</div>
        <p className="rp-center-text">You can request a new password reset link from the app&apos;s login screen.</p>
      </>
    );
  }

  if (status === "success") {
    return (
      <>
        <div className="rp-success-icon">✓</div>
        <h1 className="rp-title">Password Updated</h1>
        <p className="rp-center-text">
          Your password has been changed successfully. You can now return to the Ruya AI app and sign in with your new password.
        </p>
      </>
    );
  }

  // ready / submitting — show the form
  return (
    <>
      <div className="rp-emblem">🌙</div>
      <h1 className="rp-title">Reset Password</h1>
      <p className="rp-subtitle">Choose a new password for your Ruya AI account</p>

      {error && <div className="rp-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label className="rp-label" htmlFor="rp-password">New Password</label>
        <div className="rp-input-wrap">
          <input
            id="rp-password"
            type={showPassword ? "text" : "password"}
            className="rp-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={status === "submitting"}
            required
          />
          <button type="button" className="rp-eye" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
            {showPassword ? "HIDE" : "SHOW"}
          </button>
        </div>

        <label className="rp-label" htmlFor="rp-confirm">Confirm Password</label>
        <div className="rp-input-wrap">
          <input
            id="rp-confirm"
            type={showPassword ? "text" : "password"}
            className="rp-input"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={status === "submitting"}
            required
          />
        </div>

        <button type="submit" className="rp-btn" disabled={status === "submitting"}>
          {status === "submitting" ? "Updating..." : "Update Password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordClient() {
  return (
    <Shell>
      <Suspense
        fallback={
          <>
            <div className="rp-emblem">🌙</div>
            <h1 className="rp-title">Ruya AI</h1>
            <div className="rp-spinner" />
          </>
        }
      >
        <ResetPasswordInner />
      </Suspense>
    </Shell>
  );
}
