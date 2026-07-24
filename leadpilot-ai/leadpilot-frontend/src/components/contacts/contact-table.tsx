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
import { ChevronDown, ChevronUp, Eye, Mail, Phone } from "lucide-react";
import { ContactEntity } from "@/domain/contact/types";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatters";

interface ContactTableProps {
  data: ContactEntity[];
  onSelectContact?: (contact: ContactEntity) => void;
}

export function ContactTable({ data, onSelectContact }: ContactTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo<ColumnDef<ContactEntity>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Contact Name & Company",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar src={row.original.avatarUrl} fallback={row.original.fullName[0]} size="sm" />
            <div>
              <div className="text-xs font-bold text-white hover:text-indigo-400 cursor-pointer">
                {row.original.fullName}
              </div>
              <div className="text-[11px] text-zinc-400">
                {row.original.designation} • {row.original.companyName}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email Address",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-mono">
            <Mail className="h-3 w-3 text-zinc-500 shrink-0" />
            <span>{row.original.email}</span>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone Number",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-mono">
            <Phone className="h-3 w-3 text-zinc-500 shrink-0" />
            <span>{row.original.phone}</span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const statusVariantMap = {
            VIP: "danger",
            CLIENT: "success",
            PROSPECT: "warning",
            ACTIVE: "secondary",
            INACTIVE: "default",
          } as const;
          return (
            <Badge variant={statusVariantMap[row.original.status]} className="text-[10px]">
              {row.original.status}
            </Badge>
          );
        },
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
        accessorKey: "lastActivity",
        header: "Last Activity",
        cell: ({ row }) => (
          <span className="text-[11px] font-mono text-zinc-400">
            {formatDate(row.original.lastActivity)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onSelectContact?.(row.original)}
            className="h-7 text-xs text-indigo-400 hover:text-white"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
        ),
      },
    ],
    [onSelectContact]
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
