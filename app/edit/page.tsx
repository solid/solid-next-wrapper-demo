"use client";

/**
 * edit/page.tsx — Authenticated edit page (Client Component)
 *
 * Uses useAuth() to:
 *   - Check if the user is logged in
 *   - Get authFetch (the DPoP-authenticated fetch)
 *   - Trigger login if not authenticated
 *
 * Passes authFetch down to LocationEditor which uses it for all pod writes.
 *
 * This page must be "use client" because it uses hooks (useAuth).
 */

import { useAuth } from "@/app/lib/hooks/useAuth";
import { LocationEditor } from "@/app/components/LocationEditor";
import Link from "next/link";

export default function EditPage() {
  const { isLoggedIn, webId, authFetch, login } = useAuth();

  // Not yet logged in — show a login prompt
  if (!isLoggedIn) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Edit Locations</h1>
        <p className="mb-4 text-sm text-gray-500">You need to log in to edit locations.</p>
        <button
          type="button"
          onClick={login}
          className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Log in with Solid
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Locations</h1>
          {/* Show the logged-in WebID so users can see whose pod is being written to */}
          <p className="text-xs text-gray-400 truncate max-w-xs">Logged in as {webId}</p>
        </div>
        <Link href="/" className="text-sm text-indigo-600 no-underline hover:underline">
          ← Back
        </Link>
      </div>

      {/* The editor — receives authFetch so every pod write is authenticated */}
      <LocationEditor authFetch={authFetch} />
    </main>
  );
}
