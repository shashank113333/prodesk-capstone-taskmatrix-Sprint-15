"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { UserPlus, User, Mail, Lock, Shield, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Developer" | "Project Lead" | "Admin">("Developer");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setLoading(true);

    setTimeout(() => {
      // Correct Parameter Order: name, email, password, role
      register(name, email, password, role);
      setLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <section className="max-w-md w-full space-y-8 bg-slate-900/80 p-8 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-600/10 text-emerald-500 rounded-xl mb-2 border border-emerald-500/20">
            <UserPlus className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Create TaskMatrix Account
          </h1>
          <p className="text-sm text-slate-400">
            Register your developer profile with password security
          </p>
        </header>

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} aria-label="Registration form">
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Shashank"
                  className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@prodesk.io"
                  className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="reg-role" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Your Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Shield className="h-5 w-5" aria-hidden="true" />
                </div>
                <select
                  id="reg-role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition appearance-none"
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
            aria-label="Register & Enter Dashboard"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register & Enter Dashboard"}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>

        {/* Footer Navigation */}
        <footer className="text-center pt-2 border-t border-slate-800/80">
          <p className="text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-emerald-400 hover:text-emerald-300 transition underline-offset-4 hover:underline"
            >
              Sign In Instead
            </Link>
          </p>
        </footer>
      </section>
    </main>
  );
}