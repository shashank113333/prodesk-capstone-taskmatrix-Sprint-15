"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  Users, 
  X, 
  Mail, 
  Key, 
  ShieldCheck, 
  ShieldAlert, 
  Trash2, 
  Clock, 
  UserCheck, 
  UserX, 
  AlertTriangle,
  ChevronDown
} from "lucide-react";

interface UserAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserAccountsModal({ isOpen, onClose }: UserAccountsModalProps) {
  const { 
    registeredUsers, 
    user: currentUser, 
    deleteUserAccount, 
    suspendUserAccount, 
    reactivateUserAccount, 
    updateUserRole 
  } = useAuthStore();

  const [confirmDeleteEmail, setConfirmDeleteEmail] = useState<string | null>(null);
  const [suspendMenuUserEmail, setSuspendMenuUserEmail] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === "Admin";

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleDelete = (email: string) => {
    if (email.toLowerCase() === "admin@prodesk.io") {
      showNotice("Protection Security Guard: Primary Master Admin account (admin@prodesk.io) cannot be deleted!");
      setConfirmDeleteEmail(null);
      return;
    }
    if (currentUser?.email.toLowerCase() === email.toLowerCase()) {
      showNotice("Restriction: You cannot delete your own logged-in Admin account!");
      setConfirmDeleteEmail(null);
      return;
    }
    deleteUserAccount(email);
    setConfirmDeleteEmail(null);
    showNotice(`Account "${email}" deleted successfully.`);
  };

  const handleSuspend = (email: string, duration: '1h' | '24h' | '7d' | '30d' | 'permanent') => {
    if (email.toLowerCase() === "admin@prodesk.io") {
      showNotice("Protection Security Guard: Primary Master Admin account (admin@prodesk.io) cannot be suspended!");
      setSuspendMenuUserEmail(null);
      return;
    }
    if (currentUser?.email.toLowerCase() === email.toLowerCase()) {
      showNotice("Restriction: You cannot suspend your own logged-in Admin account!");
      setSuspendMenuUserEmail(null);
      return;
    }
    suspendUserAccount(email, duration, "Administrative Policy Enforcement");
    setSuspendMenuUserEmail(null);
    const durationLabel = 
      duration === '1h' ? '1 Hour' : 
      duration === '24h' ? '24 Hours' : 
      duration === '7d' ? '7 Days' : 
      duration === '30d' ? '30 Days' : 'Permanently Banned';
    showNotice(`Account "${email}" restriction set to: ${durationLabel}.`);
  };

  const handleReactivate = (email: string) => {
    reactivateUserAccount(email);
    showNotice(`Account "${email}" has been reactivated.`);
  };

  const handleRoleChange = (email: string, newRole: 'Developer' | 'Project Lead' | 'Admin') => {
    if (email.toLowerCase() === "admin@prodesk.io") {
      showNotice("Protection Security Guard: Primary Master Admin role (admin@prodesk.io) is locked!");
      return;
    }
    if (currentUser?.email.toLowerCase() === email.toLowerCase()) {
      showNotice("Restriction: You cannot alter your own active Admin role here!");
      return;
    }
    updateUserRole(email, newRole);
    showNotice(`Role for "${email}" updated to ${newRole}.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl p-6 space-y-5 relative animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/10 text-blue-500 rounded-xl border border-blue-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Registered Accounts Database</h2>
                {isAdmin && (
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Admin Access
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Live BaaS User Storage Directory ({registeredUsers?.length || 0} Accounts Registered)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {actionNotice && (
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-xl text-xs flex items-center justify-between animate-in fade-in duration-150">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-400 shrink-0" />
              {actionNotice}
            </span>
            <button onClick={() => setActionNotice(null)} className="text-blue-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
          {(!registeredUsers || registeredUsers.length === 0) ? (
            <div className="text-center py-10 text-slate-500 text-xs">No registered accounts found</div>
          ) : (
            registeredUsers.map((userItem) => {
              const isUserSuspended = userItem.status === 'suspended' || userItem.status === 'banned';
              const isSelf = currentUser?.email.toLowerCase() === userItem.email.toLowerCase();

              return (
                <div
                  key={userItem.uid}
                  className={`p-4 rounded-xl border transition-all ${
                    isUserSuspended 
                      ? "bg-rose-950/20 border-rose-800/40" 
                      : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  } flex flex-col gap-3`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border ${
                        isUserSuspended
                          ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                          : "bg-blue-500/20 text-blue-400 border-blue-400/30"
                      }`}>
                        {userItem.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-white">{userItem.name}</h4>
                          {isSelf && (
                            <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-400/30 font-semibold">
                              YOU
                            </span>
                          )}
                          
                          {isAdmin && !isSelf ? (
                            <select
                              value={userItem.role}
                              onChange={(e) => handleRoleChange(userItem.email, e.target.value as any)}
                              className="text-[10px] bg-slate-900 text-blue-400 border border-slate-700 rounded px-2 py-0.5 font-medium outline-none focus:border-blue-500 cursor-pointer"
                            >
                              <option value="Developer">Developer</option>
                              <option value="Project Lead">Project Lead</option>
                              <option value="Admin">Admin</option>
                            </select>
                          ) : (
                            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-medium">
                              {userItem.role}
                            </span>
                          )}

                          {userItem.status === 'banned' ? (
                            <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                              <UserX className="w-2.5 h-2.5" /> Permanently Banned
                            </span>
                          ) : userItem.status === 'suspended' ? (
                            <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" /> Suspended
                            </span>
                          ) : (
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                              <UserCheck className="w-2.5 h-2.5" /> Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                          <Mail className="w-3 h-3 text-slate-500" />
                          {userItem.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400 justify-between w-full sm:w-auto">
                      <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 font-mono">
                        UID: {userItem.uid.slice(0, 14)}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 font-mono">
                        <Key className="w-3 h-3" />
                        Encrypted
                      </span>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="pt-2.5 mt-1 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-[10px] text-slate-400">
                        {userItem.suspendedUntil && userItem.suspendedUntil !== 'PERMANENT' && (
                          <span className="text-amber-400/90 font-mono">
                            Expires: {new Date(userItem.suspendedUntil).toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-auto">
                        {isUserSuspended && (
                          <button
                            onClick={() => handleReactivate(userItem.email)}
                            className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-medium flex items-center gap-1 transition"
                          >
                            <UserCheck className="w-3 h-3" /> Reactivate Account
                          </button>
                        )}

                        {!isSelf && (
                          <div className="relative">
                            <button
                              onClick={() => setSuspendMenuUserEmail(suspendMenuUserEmail === userItem.email ? null : userItem.email)}
                              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg text-[10px] font-medium flex items-center gap-1 transition"
                            >
                              <Clock className="w-3 h-3" /> Restrict Access <ChevronDown className="w-3 h-3 opacity-60" />
                            </button>

                            {suspendMenuUserEmail === userItem.email && (
                              <div className="absolute right-0 bottom-full mb-1 z-20 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-1 space-y-0.5 text-[11px]">
                                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 border-b border-slate-800">
                                  Select Suspension:
                                </div>
                                <button
                                  onClick={() => handleSuspend(userItem.email, '1h')}
                                  className="w-full text-left px-2 py-1 text-slate-300 hover:bg-slate-800 rounded transition"
                                >
                                  Suspend for 1 Hour
                                </button>
                                <button
                                  onClick={() => handleSuspend(userItem.email, '24h')}
                                  className="w-full text-left px-2 py-1 text-slate-300 hover:bg-slate-800 rounded transition"
                                >
                                  Suspend for 24 Hours
                                </button>
                                <button
                                  onClick={() => handleSuspend(userItem.email, '7d')}
                                  className="w-full text-left px-2 py-1 text-slate-300 hover:bg-slate-800 rounded transition"
                                >
                                  Suspend for 7 Days
                                </button>
                                <button
                                  onClick={() => handleSuspend(userItem.email, '30d')}
                                  className="w-full text-left px-2 py-1 text-slate-300 hover:bg-slate-800 rounded transition"
                                >
                                  Suspend for 30 Days
                                </button>
                                <button
                                  onClick={() => handleSuspend(userItem.email, 'permanent')}
                                  className="w-full text-left px-2 py-1 text-rose-400 font-semibold hover:bg-rose-950/40 rounded transition"
                                >
                                  Permanent Ban
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {!isSelf && (
                          confirmDeleteEmail === userItem.email ? (
                            <div className="flex items-center gap-1 animate-in fade-in duration-100">
                              <span className="text-[10px] text-rose-400 font-semibold">Confirm Delete?</span>
                              <button
                                onClick={() => handleDelete(userItem.email)}
                                className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold transition"
                              >
                                Yes, Delete
                              </button>
                              <button
                                onClick={() => setConfirmDeleteEmail(null)}
                                className="px-2 py-1 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-[10px] transition"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteEmail(userItem.email)}
                              className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-[10px] font-medium flex items-center gap-1 transition"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <div>
            {isAdmin ? (
              <span className="text-emerald-400 font-medium">Full RBAC Control Active: Delete, Suspend (1h/24h/7d/30d/Perm), Change Role</span>
            ) : (
              <span>View-only Account Directory</span>
            )}
          </div>
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
