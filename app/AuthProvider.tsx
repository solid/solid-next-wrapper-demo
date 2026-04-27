"use client";

/**
 * AuthProvider.tsx
 *
 * A tiny client component whose only job is to call handleIncomingRedirect()
 * once when the app first loads in the browser.
 *
 * WHY a separate component?
 *   Next.js App Router layouts are Server Components by default.
 *   Server Components cannot use useEffect or browser APIs.
 *   By extracting this into a "use client" component we keep layout.tsx
 *   as a Server Component while still running the OIDC redirect logic.
 *
 * handleIncomingRedirect() checks whether the URL contains an auth code
 * from the identity provider and, if so, completes the login handshake.
 * With restorePreviousSession: true it also silently re-logs in on refresh.
 */

import { useEffect } from "react";
import { handleIncomingRedirect } from "@inrupt/solid-client-authn-browser";

export function AuthProvider() {
  useEffect(() => {
    handleIncomingRedirect({ restorePreviousSession: true });
  }, []);

  // Renders nothing — purely a side-effect component
  return null;
}
