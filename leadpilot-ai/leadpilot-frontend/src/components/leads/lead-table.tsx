"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  MessageSquare,
  PhoneCall,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeadItem } from "./lead-feedback";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { toast } from "sonner";

interface LeadTableProps {
  data: LeadItem[];
  density?: "compact" | "standard" | "spacious";
  selectedRowIds: Record<string, boolean>;
  onRowSelectionChange: (selection: Record<string, boolean>) => void;
  onSelectLead?: (lead: LeadItem) => void;
}

export function LeadTable({
  data,
  density = "standard",
  selectedRowIds,
  onRowSelectionChange,
  onSelectLead,
}: LeadTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  // Memoize column definitions for performance
  const columns = React.useMemo<ColumnDef<LeadItem>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            aria-label="Select all rows"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            aria-label={`Select row for ${row.original.fullName}`}
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "fullName",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1"
          >
            <span>LEAD NAME</span>
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => {
          const lead = row.original;
          return (
            <div
              onClick={() => onSelectLead?.(lead)}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <Avatar src={lead.avatarUrl} fallback={lead.fullName[0]} size="sm" />
              <div className="flex flex-col">
                <span className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                  {lead.fullName}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">ID: {lead.id}</span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "phone",
        header: "CONTACT",
        cell: ({ row }) => {
          const lead = row.original;
          return (
            <div className="flex flex-col">
              <span className="text-xs text-zinc-200">{lead.phone || "—"}</span>
              <span className="text-[11px] text-zinc-400 truncate max-w-[150px]">
                {lead.email || "—"}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ row }) => {
          const status = row.original.status;
          const variantMap = {
            NEW: "default",
            CONTACTED: "secondary",
            QUALIFIED: "success",
            NURTURING: "warning",
            LOST: "danger",
          } as const;
          return (
            <Badge variant={variantMap[status] || "secondary"} className="text-[10px] px-2 py-0.5">
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "source",
        header: "SOURCE",
        cell: ({ row }) => (
          <span className="inline-block rounded bg-zinc-800/80 px-2 py-0.5 text-[11px] font-medium text-zinc-300 border border-zinc-700/50">
            {row.original.source}
          </span>
        ),
      },
      {
        accessorKey: "aiPropensityScore",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1"
          >
            <Sparkles className="h-3 w-3 text-violet-400" />
            <span>AI SCORE</span>
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => {
          const score = row.original.aiPropensityScore;
          return (
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    score >= 75
                      ? "bg-violet-500"
                      : score >= 50
                      ? "bg-indigo-500"
                      : "bg-zinc-600"
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="font-mono text-xs font-bold text-violet-300">{score}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "budgetMax",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1"
          >
            <span>BUDGET</span>
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => {
          const lead = row.original;
          return (
            <span className="font-mono text-xs font-semibold text-zinc-200">
              {formatCurrency(lead.budgetMin)} - {formatCurrency(lead.budgetMax)}
            </span>
          );
        },
      },
      {
        accessorKey: "assignedBrokerName",
        header: "AGENT",
        cell: ({ row }) => (
          <span className="text-xs text-zinc-300">{row.original.assignedBrokerName}</span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "CREATED",
        cell: ({ row }) => (
          <span className="text-[11px] font-mono text-zinc-400">
            {formatDate(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const lead = row.original;
          return (
            <div className="relative flex items-center justify-end gap-1">
              <button
                onClick={() => toast.info(`WhatsApp Drip launched for ${lead.fullName}`)}
                className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-indigo-400 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500"
                title="Open WhatsApp Drip"
                aria-label={`Open WhatsApp for ${lead.fullName}`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => toast.info(`Initiating Call to ${lead.phone || lead.fullName}`)}
                className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-emerald-400 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500"
                title="Call Lead"
                aria-label={`Call ${lead.fullName}`}
              >
                <PhoneCall className="h-3.5 w-3.5" />
              </button>

              {/* More Menu Toggle */}
              <button
                onClick={() => setActiveMenuId(activeMenuId === lead.id ? null : lead.id)}
                className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500"
                aria-label={`More actions for ${lead.fullName}`}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>

              {activeMenuId === lead.id && (
                <div className="absolute right-0 top-7 w-36 rounded-xl border border-zinc-800 bg-zinc-900 p-1 shadow-xl z-20 animate-in fade-in duration-100">
                  <button
                    onClick={() => {
                      setActiveMenuId(null);
                      onSelectLead?.(lead);
                    }}
                    className="flex w-full items-center px-2.5 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800 rounded-lg text-left"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenuId(null);
                      toast.info(`Converting ${lead.fullName} to Deal`);
                    }}
                    className="flex w-full items-center px-2.5 py-1.5 text-xs text-indigo-400 hover:bg-indigo-500/10 rounded-lg text-left"
                  >
                    Convert to Deal
                  </button>
                </div>
              )}
            </div>
          );
        },
      },
    ],
    [activeMenuId, onSelectLead]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection: selectedRowIds,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: (updater) => {
      const nextSelection = typeof updater === "function" ? updater(selectedRowIds) : updater;
      onRowSelectionChange(nextSelection);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const densityRowHeight = {
    compact: "h-9",
    standard: "h-12",
    spacious: "h-14",
  }[density];

  return (
    <div className="space-y-4">
      {/* Scrollable Data Table Container */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 overflow-hidden shadow-sm">
        <Table aria-label="Lead Management Data Grid">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={densityRowHeight}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-1 text-xs text-zinc-400">
        <div>
          Showing{" "}
          <span className="font-semibold text-white">
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-white">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              data.length
            )}
          </span>{" "}
          of <span className="font-semibold text-white">{data.length}</span> lead records
        </div>

        <div className="flex items-center gap-3">
          {/* Items per page selector */}
          <div className="flex items-center gap-1.5">
            <span>Per page:</span>
            <select
              aria-label="Items per page"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="h-8 rounded-md border border-zinc-800 bg-zinc-900 px-2 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              {[5, 10, 20, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              aria-label="Previous Page"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 font-mono">
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
            </span>
            <Button
              size="sm"
              variant="outline"
              aria-label="Next Page"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
