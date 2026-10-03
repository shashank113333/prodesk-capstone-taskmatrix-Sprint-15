"use client";

import React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Users, X, ShieldCheck, Mail, Calendar, Key } from "lucide-react";

interface UserAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserAccountsModal({ isOpen, onClose }: UserAccountsModalProps) {
  const { registeredUsers } = useAuthStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl p-6 space-y-6 relative animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/10 text-blue-500 rounded-xl border border-blue-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Registered Accounts Database</h2>
              <p className="text-xs text-slate-400">Live BaaS User Storage Directory ({registeredUsers?.length || 0} Accounts)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Table List */}
        <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
          {(!registeredUsers || registeredUsers.length === 0) ? (
            <div className="text-center py-8 text-slate-500 text-xs">No registered accounts found</div>
          ) : (
            registeredUsers.map((userItem) => (
              <div
                key={userItem.uid}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center font-bold text-sm shrink-0">
                    {userItem.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{userItem.name}</h4>
                      <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-medium">
                        {userItem.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-500" />
                      {userItem.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-slate-400 border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-between sm:justify-end border-slate-800">
                  <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 font-mono">
                    UID: {userItem.uid}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 font-mono">
                    <Key className="w-3 h-3" />
                    Protected
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
}
