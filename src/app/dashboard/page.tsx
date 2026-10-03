"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useTaskStore, Task } from "@/store/useTaskStore";
import TaskModal from "@/components/TaskModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import RbacDeleteModal from "@/components/RbacDeleteModal";
import TaskAnalyticsChart from "@/components/TaskAnalyticsChart";
import UserAccountsModal from "@/components/UserAccountsModal";
import {
  Kanban,
  LogOut,
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Calendar,
  Users,
  ChevronRight,
  ChevronLeft,
  Lock,
  ShieldAlert,
  X,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, hydrateAuth } = useAuthStore();
  const {
    tasks,
    hydrateTasks,
    deleteTask,
    updateTask,
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
  } = useTaskStore();

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{ id: string; title: string } | null>(null);

  // RBAC Delete Guard Modal State (for Developer Role)
  const [isRbacDeleteModalOpen, setIsRbacDeleteModalOpen] = useState(false);

  // User Accounts Database Modal State & Floating Notification State
  const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // 1. Hydrate Authentication State & Tasks
  useEffect(() => {
    hydrateAuth();
    setLoading(false);
  }, [hydrateAuth]);

  useEffect(() => {
    if (user?.email) {
      hydrateTasks(user.email);
    }
  }, [user, hydrateTasks]);

  // 2. ROUTE GUARD: Intercept unauthenticated access
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-400">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium">Verifying Auth State & Route Protection...</p>
      </div>
    );
  }

  const isAdmin = user?.role === "Admin";
  const isProjectLead = user?.role === "Project Lead";
  const isDeveloper = user?.role === "Developer";

  // Filter Tasks based on Search & Priority
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority =
      priorityFilter === "ALL" || task.priority.toUpperCase() === priorityFilter.toUpperCase();

    return matchesSearch && matchesPriority;
  });

  const columns = [
    { id: "todo", title: "To Do", color: "border-slate-800 bg-slate-900/40", badgeColor: "bg-slate-800 text-slate-300" },
    { id: "in_progress", title: "In Progress", color: "border-blue-500/30 bg-blue-950/20", badgeColor: "bg-blue-500/20 text-blue-400" },
    { id: "in_review", title: "In Review", color: "border-amber-500/30 bg-amber-950/20", badgeColor: "bg-amber-500/20 text-amber-400" },
    { id: "done", title: "Done", color: "border-emerald-500/30 bg-emerald-950/20", badgeColor: "bg-emerald-500/20 text-emerald-400" },
  ];

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  // RBAC TASK DELETION GUARD
  const handleOpenDeleteModal = (id: string, title: string) => {
    // If user is a Developer, trigger clean RBAC Pop-up Modal
    if (isDeveloper) {
      setIsRbacDeleteModalOpen(true);
      return;
    }
    // If Scrum Lead or Admin, proceed to confirmation modal
    setTaskToDelete({ id, title });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const handleOpenAccountsModal = () => {
    if (!isAdmin) {
      setToastNotice(`Admin Authorization Required: Registered Accounts DB is restricted to System Administrators. (Your Role: ${user?.role})`);
      setTimeout(() => setToastNotice(null), 4000);
      return;
    }
    setIsAccountsModalOpen(true);
  };

  // Quick Move Column Handler
  const moveTaskStatus = (task: Task, direction: "next" | "prev") => {
    const statusOrder: Task["status"][] = ["todo", "in_progress", "in_review", "done"];
    const currentIndex = statusOrder.indexOf(task.status);
    let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < statusOrder.length) {
      updateTask(task.id, { status: statusOrder[newIndex] });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      {/* Floating Toast Notification */}
      {toastNotice && (
        <div className="fixed top-20 right-6 z-50 max-w-sm bg-slate-900 border border-amber-500/40 text-amber-300 p-4 rounded-2xl shadow-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top duration-300 backdrop-blur-md">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="text-xs font-bold text-amber-200">Access Control Notice</p>
            <p className="text-[11px] leading-relaxed text-slate-300">{toastNotice}</p>
          </div>
          <button
            onClick={() => setToastNotice(null)}
            className="text-slate-400 hover:text-white p-0.5 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/30">
              <Kanban className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                TaskMatrix
              </h1>
              <span className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold block">
                Agile Project Management
              </span>
            </div>
          </div>

          {/* User Profile Badge, Accounts DB & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700">
              <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-400 flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-white leading-tight">{user?.name || "Shashank"}</p>
                <p className="text-[10px] text-slate-400 leading-tight">{user?.email || "developer@prodesk.io"}</p>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                  isAdmin
                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                    : isProjectLead
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                }`}
              >
                {user?.role || "Developer"}
              </span>
            </div>

            {/* Registered User Accounts Directory Button */}
            <button
              onClick={handleOpenAccountsModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                isAdmin
                  ? "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/20"
                  : "bg-slate-800/50 text-slate-500 border-slate-800 hover:border-slate-700"
              }`}
              title={isAdmin ? "View Registered User Directory" : "Admin Authorization Required"}
            >
              {isAdmin ? <Users className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Accounts DB</span>
            </button>

            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition"
              title="Sign Out of Session"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Phase 3 Data Visualization Analytics Section */}
        <TaskAnalyticsChart tasks={tasks} />

        {/* Toolbar: Search, Priority Filter, and Create Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sprint tasks by title..."
                className="w-full bg-slate-950 border border-slate-800 pl-9 pr-4 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
              >
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>
          </div>

          {/* CREATE Action Button (Phase 1 Requirement) */}
          <button
            onClick={handleOpenCreateModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            Add New Task
          </button>
        </div>

        {/* 4-Column Agile Kanban Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);

            return (
              <div key={col.id} className={`rounded-2xl border p-4 flex flex-col gap-4 ${col.color}`}>
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <span className="font-semibold text-xs text-slate-200 tracking-wide uppercase">
                    {col.title}
                  </span>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full border border-slate-700/50 ${col.badgeColor}`}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Task Cards List */}
                <div className="space-y-3 flex-1 min-h-[120px]">
                  {colTasks.length === 0 ? (
                    <div className="h-24 border border-dashed border-slate-800/60 rounded-xl flex items-center justify-center text-[11px] text-slate-500 italic">
                      No tasks in {col.title}
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3 hover:border-slate-700 transition shadow-md group relative"
                      >
                        {/* Priority Badge & Action Buttons */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                              task.priority === "High"
                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                : task.priority === "Medium"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            }`}
                          >
                            {task.priority} Priority
                          </span>

                          {/* EDIT & DELETE Action Buttons */}
                          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
                            <button
                              onClick={() => handleOpenEditModal(task)}
                              className="p-1 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition"
                              title="Edit Task"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(task.id, task.title)}
                              className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                              title="Delete Task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h3 className="text-xs font-bold text-slate-100 leading-snug">{task.title}</h3>
                          {task.description && (
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Due Date & Quick Navigation Controls */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span>{task.dueDate || "No due date"}</span>
                          </div>

                          {/* Status Shift Buttons */}
                          <div className="flex items-center gap-1">
                            {task.status !== "todo" && (
                              <button
                                onClick={() => moveTaskStatus(task, "prev")}
                                className="p-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition"
                                title="Move Left"
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                            )}
                            {task.status !== "done" && (
                              <button
                                onClick={() => moveTaskStatus(task, "next")}
                                className="p-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition"
                                title="Move Right"
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Task Create/Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={taskToEdit}
      />

      {/* Task Safety Delete Confirmation Modal (for Project Lead & Admin) */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        taskTitle={taskToDelete?.title || ""}
      />

      {/* RBAC Delete Warning Modal (for Developer Role) */}
      <RbacDeleteModal
        isOpen={isRbacDeleteModalOpen}
        onClose={() => setIsRbacDeleteModalOpen(false)}
        userRole={user?.role}
      />

      {/* User Accounts Database Directory Modal */}
      <UserAccountsModal
        isOpen={isAccountsModalOpen}
        onClose={() => setIsAccountsModalOpen(false)}
      />
    </div>
  );
}