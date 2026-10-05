"use client";

import React from "react";
import { Task } from "@/store/useTaskStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { BarChart3, PieChart as PieIcon, CheckCircle2 } from "lucide-react";

interface TaskAnalyticsChartProps {
  tasks: Task[];
}

export default function TaskAnalyticsChart({ tasks }: TaskAnalyticsChartProps) {
  const statusCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    { todo: 0, in_progress: 0, in_review: 0, done: 0 } as Record<string, number>
  );

  const priorityCounts = tasks.reduce(
    (acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    },
    { High: 0, Medium: 0, Low: 0 } as Record<string, number>
  );

  const statusData = [
    { name: "To Do", count: statusCounts.todo, color: "#64748b" },
    { name: "In Progress", count: statusCounts.in_progress, color: "#3b82f6" },
    { name: "In Review", count: statusCounts.in_review, color: "#f59e0b" },
    { name: "Done", count: statusCounts.done, color: "#10b981" },
  ];

  const priorityData = [
    { name: "High", value: priorityCounts.High, color: "#ef4444" },
    { name: "Medium", value: priorityCounts.Medium, color: "#f59e0b" },
    { name: "Low", value: priorityCounts.Low, color: "#10b981" },
  ];

  const totalTasks = tasks.length;
  const completedTasks = statusCounts.done || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-6 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/10 text-blue-500 rounded-xl border border-blue-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Sprint 15 Data Analytics Engine</h2>
            <p className="text-xs text-slate-400">Live Task Status & Priority Metrics (.reduce Aggregated)</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Completion Velocity:</span>
          <span className="text-emerald-400 font-bold">{completionRate}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Tasks by Kanban Column Status
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Count by Column</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc", fontSize: "12px" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <PieIcon className="w-3.5 h-3.5 text-amber-400" />
              Priority Distribution
            </span>
            <span className="text-[10px] font-mono text-slate-400">{totalTasks} Total</span>
          </div>

          <div className="space-y-2.5 py-1">
            {priorityData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-300 font-medium">{item.name} Priority</span>
                </div>
                <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {item.value} tasks
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 text-center">
            Real-time BaaS state visualization active
          </div>
        </div>
      </div>
    </div>
  );
}