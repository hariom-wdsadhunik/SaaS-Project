"use client";

import * as React from "react";
import Image from "next/image";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, MapPin, Eye } from "lucide-react";
import { PropertyEntity } from "@/domain/property/types";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface PropertyTableProps {
  data: PropertyEntity[];
  onSelectProperty?: (property: PropertyEntity) => void;
}

export function PropertyTable({ data, onSelectProperty }: PropertyTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo<ColumnDef<PropertyEntity>[]>(
    () => [
      {
        id: "thumbnail",
        header: "",
        cell: ({ row }) => (
          <div className="relative h-10 w-14 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
            <Image
              src={row.original.coverImageUrl}
              alt={row.original.title}
              fill
              sizes="60px"
              className="object-cover"
            />
          </div>
        ),
      },
      {
        accessorKey: "title",
        header: "Property Name & Address",
        cell: ({ row }) => (
          <div>
            <div className="text-xs font-bold text-white hover:text-indigo-400 cursor-pointer">
              {row.original.title}
            </div>
            <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 text-zinc-500 shrink-0" />
              <span>
                {row.original.address}, {row.original.city}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: "Listing Price",
        cell: ({ row }) => (
          <span className="text-xs font-extrabold font-mono text-emerald-400">
            {formatCurrency(row.original.price)}
          </span>
        ),
      },
      {
        accessorKey: "propertyType",
        header: "Type",
        cell: ({ row }) => (
          <Badge variant="outline" className="text-[10px]">
            {row.original.propertyType}
          </Badge>
        ),
      },
      {
        accessorKey: "bedrooms",
        header: "Specs",
        cell: ({ row }) => (
          <span className="text-xs text-zinc-300 font-mono">
            {row.original.bedrooms} Bed • {row.original.bathrooms} Bath • {row.original.areaSqFt.toLocaleString()} sqft
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const statusVariantMap = {
            AVAILABLE: "success",
            RESERVED: "warning",
            SOLD: "secondary",
            OFF_MARKET: "default",
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
        header: "Broker Agent",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar src={row.original.agentAvatarUrl} fallback={row.original.assignedAgentName[0]} size="sm" />
            <span className="text-xs text-zinc-300 font-mono">{row.original.assignedAgentName}</span>
          </div>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ row }) => (
          <span className="text-[11px] font-mono text-zinc-400">
            {formatDate(row.original.updatedAt)}
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
            onClick={() => onSelectProperty?.(row.original)}
            className="h-7 text-xs text-indigo-400 hover:text-white"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
        ),
      },
    ],
    [onSelectProperty]
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
