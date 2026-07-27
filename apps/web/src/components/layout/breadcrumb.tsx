"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return (
      <div className="flex items-center gap-1 text-xs text-zinc-400">
        <Home className="h-3.5 w-3.5" />
        <span>Dashboard</span>
      </div>
    );
  }

  return (
    <nav className="flex items-center gap-1.5 text-xs text-zinc-400">
      <Link href="/dashboard" className="hover:text-zinc-200 transition-colors">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const formattedSegment =
          segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");

        return (
          <div key={href} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
            {isLast ? (
              <span className="font-medium text-zinc-200">{formattedSegment}</span>
            ) : (
              <Link href={href} className="hover:text-zinc-200 transition-colors">
                {formattedSegment}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
