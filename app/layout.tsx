/**
 * layout.tsx — Root layout (wraps every page)
 *
 * Two jobs:
 *   1. Import globals.css so Tailwind + plain CSS apply everywhere
 *   2. Call handleIncomingRedirect() on the client after the OIDC provider
 *      redirects back — this completes the login flow and restores the session.
 *
 * We do the redirect handling in a tiny "use client" sub-component so that
 * the layout itself can remain a Server Component (required by Next.js App Router).
 */

import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./AuthProvider";

export const metadata: Metadata = {
  title: "Solid Locations Demo",
  description: "A minimal demo of @rdfjs/wrapper + Solid + Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {/* AuthProvider handles the OIDC redirect on the client */}
        <AuthProvider />
        {children}
      </body>
    </html>
  );
}
