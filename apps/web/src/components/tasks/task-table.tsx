"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Calendar, CheckCircle2 } from "lucide-react";
import { TaskEntity } from "@/domain/task/types";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EntityStatusBadge } from "@/platform/ui/entity-status-badge";
import { formatDate } from "@/utils/formatters";
import { toast } from "sonner";

interface TaskTableProps {
  data: TaskEntity[];
  onSelectTask?: (task: TaskEntity) => void;
}

export function TaskTable({ data, onSelectTask }: TaskTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo<ColumnDef<TaskEntity>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Task & Category",
        cell: ({ row }) => (
          <div>
            <div
              onClick={() => onSelectTask?.(row.original)}
              className="text-xs font-bold text-white hover:text-indigo-400 cursor-pointer"
            >
              {row.original.title}
            </div>
            <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
              {row.original.category} • {row.original.relatedEntityName || "Unlinked"}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
          const priorityVariantMap = {
            URGENT: "danger",
            HIGH: "warning",
            MEDIUM: "secondary",
            LOW: "default",
          } as const;
          return (
            <Badge variant={priorityVariantMap[row.original.priority]} className="text-[10px]">
              {row.original.priority}
            </Badge>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <EntityStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "dueDate",
        header: "Due Date",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-mono">
            <Calendar className="h-3 w-3 text-zinc-500 shrink-0" />
            <span>{formatDate(row.original.dueDate)}</span>
          </div>
        ),
      },
      {
        accessorKey: "assignedAgentName",
        header: "Assigned Agent",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar src={row.original.agentAvatarUrl} fallback={row.original.assignedAgentName[0]} size="sm" />
            <span className="text-xs text-zinc-300 font-mono">{row.original.assignedAgentName}</span>
          </div>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              toast.success(`Task "${row.original.title}" marked as COMPLETED`);
            }}
            className="h-7 text-xs text-emerald-400 hover:text-white"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
          </Button>
        ),
      },
    ],
    [onSelectTask]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 uppercase font-semibold">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-3.5 font-medium">
                    {header.isPlaceholder ? null : (
                      <div
                        onClick={header.column.getToggleSortingHandler()}
                        className={header.column.getCanSort() ? "cursor-pointer flex items-center gap-1 select-none" : ""}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ChevronUp className="h-3 w-3 text-indigo-400" />,
                          desc: <ChevronDown className="h-3 w-3 text-indigo-400" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-zinc-900/60 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
