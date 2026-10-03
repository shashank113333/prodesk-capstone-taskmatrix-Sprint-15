"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { KeyRound, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuthStore();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !newPassword) return;

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match! Please verify your password entry." });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = resetPassword(email, newPassword);
      setLoading(false);

      if (res.success) {
        setMessage({
          type: "success",
          text: `Password updated successfully for "${email}"! You can now sign in with your new password.`,
        });
      } else {
        setMessage({ type: "error", text: res.error || "Failed to reset password." });
      }
    }, 600);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <section className="max-w-md w-full space-y-8 bg-slate-900/80 p-8 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-amber-600/10 text-amber-500 rounded-xl mb-2 border border-amber-500/20">
            <KeyRound className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm text-slate-400">
            Enter your registered email address to set a new password
          </p>
        </header>

        {/* Success / Error Notification */}
        {message && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 text-xs animate-in fade-in zoom-in duration-200 ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="font-semibold">{message.type === "success" ? "Success!" : "Reset Failed"}</p>
              <p>{message.text}</p>
              {message.type === "success" && (
                <Link href="/login" className="inline-block pt-1 font-bold underline text-emerald-400 hover:text-emerald-300">
                  Proceed to Sign In →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Reset Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} aria-label="Reset Password Form">
          <div className="space-y-4">
            {/* Email Address */}
            <div>
              <label htmlFor="reset-email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Registered Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@prodesk.io"
                  className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="reset-new-password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="reset-new-password"
                  name="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
                />
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label htmlFor="reset-confirm-password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="reset-confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            aria-label="Update Password"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition shadow-lg shadow-amber-600/20 disabled:opacity-50"
          >
            {loading ? "Updating Password..." : "Update Password"}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>

        {/* Footer Navigation */}
        <footer className="text-center pt-2 border-t border-slate-800/80">
          <p className="text-sm text-slate-400">
            Remembered your password?{" "}
            <Link href="/login" className="font-medium text-amber-400 hover:text-amber-300 transition underline-offset-4 hover:underline">
              Back to Sign In
            </Link>
          </p>
        </footer>
      </section>
    </main>
  );
}