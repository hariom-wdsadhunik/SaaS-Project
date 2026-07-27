import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full">
        <h1 className="text-6xl font-black text-blue-500 mb-2">404</h1>
        <h2 className="text-xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-sm text-zinc-400 mb-6">
          The requested CRM page, contact profile, or pipeline view does not exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
