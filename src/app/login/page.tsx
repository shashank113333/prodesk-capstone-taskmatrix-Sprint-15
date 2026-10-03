"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { LogIn, Lock, Mail, Shield, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, hydrateAuth, loginError, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"Developer" | "Project Lead" | "Admin">("Developer");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    clearError();
    setLoading(true);

    setTimeout(() => {
      const success = login(email, password, role);
      setLoading(false);

      if (success) {
        router.push("/dashboard");
      }
    }, 500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <section className="max-w-md w-full space-y-8 bg-slate-900/80 p-8 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600/10 text-blue-500 rounded-xl mb-2 border border-blue-500/20">
            <LogIn className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Sign in to TaskMatrix
          </h1>
          <p className="text-sm text-slate-400">
            Enter your registered developer credentials to access your workspace
          </p>
        </header>

        {/* Verification & Password Error Alert Box */}
        {loginError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 text-red-400 text-xs animate-in fade-in zoom-in duration-200">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-red-300">Authentication Failed</p>
              <p>{loginError}</p>
              <div className="flex items-center gap-3 pt-1">
                <Link href="/register" className="font-bold underline text-red-400 hover:text-red-300">
                  Register Account →
                </Link>
                <span className="text-slate-600">|</span>
                <Link href="/forgot-password" className="font-bold underline text-blue-400 hover:text-blue-300">
                  Reset Password →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} aria-label="Login form">
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    clearError();
                    setEmail(e.target.value);
                  }}
                  placeholder="developer@prodesk.io"
                  className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            {/* Password Field with Eye Toggle Icon */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="login-password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    clearError();
                    setPassword(e.target.value);
                  }}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Role Switcher */}
            <div>
              <label htmlFor="login-role" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Agile Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Shield className="h-5 w-5" aria-hidden="true" />
                </div>
                <select
                  id="login-role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition appearance-none"
                >
                  <option value="Developer">Frontend Specialist (Developer)</option>
                  <option value="Project Lead">Scrum Master / Project Lead</option>
                  <option value="Admin">System Administrator</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            aria-label="Sign In to Dashboard"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {loading ? "Verifying Credentials..." : "Sign In to Dashboard"}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>

        {/* Footer Navigation */}
        <footer className="text-center pt-2 border-t border-slate-800/80">
          <p className="text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-400 hover:text-blue-300 transition underline-offset-4 hover:underline"
            >
              Create Account First
            </Link>
          </p>
        </footer>
      </section>
    </main>
  );
}