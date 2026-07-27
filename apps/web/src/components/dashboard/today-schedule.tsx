"use client";

import * as React from "react";
import { Calendar, CheckSquare, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Appointment {
  id: string;
  time: string;
  clientName: string;
  propertyTitle: string;
  location: string;
  status: "CONFIRMED" | "PENDING";
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: "URGENT" | "HIGH" | "NORMAL";
  completed: boolean;
}

const mockAppointments: Appointment[] = [
  {
    id: "app-1",
    time: "10:30 AM",
    clientName: "John Doe",
    propertyTitle: "Downtown Luxury Villa #04",
    location: "Downtown Palm Boulevard",
    status: "CONFIRMED",
  },
  {
    id: "app-2",
    time: "02:00 PM",
    clientName: "Sarah Jenkins",
    propertyTitle: "Marina Bay Penthouse",
    location: "Marina Tower 2",
    status: "CONFIRMED",
  },
  {
    id: "app-3",
    time: "04:30 PM",
    clientName: "David Miller",
    propertyTitle: "Palm Jumeirah Residence",
    location: "Frond B Villa",
    status: "PENDING",
  },
];

const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Send WhatsApp property brochure to John Doe",
    dueDate: "Today 11:00 AM",
    priority: "URGENT",
    completed: false,
  },
  {
    id: "task-2",
    title: "Verify e-signature on Marina Bay contract",
    dueDate: "Today 01:30 PM",
    priority: "HIGH",
    completed: false,
  },
  {
    id: "task-3",
    title: "Follow up on buyer mortgage pre-approval",
    dueDate: "Today 05:00 PM",
    priority: "NORMAL",
    completed: true,
  },
];

export function TodaySchedule() {
  const [activeTab, setActiveTab] = React.useState<"appointments" | "tasks">("appointments");
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = !t.completed;
          if (updated) {
            toast.success("Task Marked Complete", { description: t.title });
          }
          return { ...t, completed: updated };
        }
        return t;
      })
    );
  };

  return (
    <Card className="border-zinc-800/80 bg-zinc-900/80 p-6 shadow-sm">
      <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-white">Today&apos;s Schedule &amp; Actions</CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            Site viewings, meetings, and high-priority broker tasks
          </CardDescription>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-1">
          <button
            onClick={() => setActiveTab("appointments")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              activeTab === "appointments"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Viewings ({mockAppointments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              activeTab === "tasks"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Tasks ({tasks.filter((t) => !t.completed).length})</span>
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {activeTab === "appointments" ? (
          mockAppointments.map((app) => (
            <div
              key={app.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-3 hover:border-zinc-700 transition-colors gap-2"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-16 flex-col items-center justify-center rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-xs font-mono font-semibold text-indigo-400 shrink-0">
                  <Clock className="h-3 w-3 mb-0.5 text-zinc-500" />
                  <span>{app.time}</span>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-white">{app.clientName}</p>
                  <p className="text-[11px] text-zinc-300 font-medium">{app.propertyTitle}</p>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                    <MapPin className="h-3 w-3 text-zinc-500" />
                    <span>{app.location}</span>
                  </div>
                </div>
              </div>

              <Badge
                variant={app.status === "CONFIRMED" ? "success" : "warning"}
                className="self-end sm:self-auto text-[10px] px-2 py-0.5"
              >
                {app.status}
              </Badge>
            </div>
          ))
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-colors ${
                task.completed
                  ? "border-zinc-800/40 bg-zinc-950/20 opacity-60"
                  : "border-zinc-800/60 bg-zinc-950/40 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                    task.completed
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-zinc-700 bg-zinc-900"
                  }`}
                >
                  {task.completed && <CheckCircle2 className="h-3.5 w-3.5" />}
                </div>
                <span
                  className={`text-xs font-medium ${
                    task.completed ? "line-through text-zinc-500" : "text-zinc-200"
                  }`}
                >
                  {task.title}
                </span>
              </div>

              <Badge
                variant={
                  task.priority === "URGENT"
                    ? "danger"
                    : task.priority === "HIGH"
                    ? "warning"
                    : "secondary"
                }
                className="text-[10px] px-2 py-0.5 shrink-0"
              >
                {task.priority}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
