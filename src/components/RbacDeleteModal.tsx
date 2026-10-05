"use client";

import React from "react";
import { ShieldAlert, X, Lock } from "lucide-react";

interface RbacDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

export default function RbacDeleteModal({ isOpen, onClose, userRole }: RbacDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5 relative animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">RBAC Permission Restriction</h3>
              <p className="text-xs text-slate-400">Authorization Guard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <p className="text-xs font-semibold text-amber-400 leading-relaxed">
            "RBAC Restriction: Task deletion requires Scrum Lead or Admin authorization"
          </p>
          <p className="text-[11px] text-slate-400 leading-normal">
            Your current authenticated role is <span className="text-blue-400 font-semibold">{userRole || "Frontend Specialist (Developer)"}</span>. To execute task deletion, please sign in with Scrum Master or Admin credentials.
          </p>
        </div>

        <div className="flex items-center justify-end pt-1">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-amber-600/20 transition"
          >
            <Lock className="w-3.5 h-3.5" />
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
