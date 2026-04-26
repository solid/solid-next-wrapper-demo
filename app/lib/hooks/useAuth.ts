"use client";

/**
 * useAuth.ts
 *
 * Wraps @inrupt/solid-client-authn-browser into a simple React hook.
 *
 * The three functions we use from the library:
 *   handleIncomingRedirect() — must run on page load to complete the OIDC flow
 *                              (the identity provider redirects back with a code)
 *   getDefaultSession()      — returns the singleton session object
 *   login()                  — redirects the user to the OIDC provider login page
 *
 * Returns:
 *   isLoggedIn  — whether the user has an active session
 *   webId       — the user's WebID IRI (e.g. https://id.inrupt.com/alice)
 *   authFetch   — a drop-in replacement for fetch() that adds DPoP auth headers
 *   login()     — call this to start the login flow
 */

import { useEffect, useState } from "react";
import {
  handleIncomingRedirect,
  getDefaultSession,
  login as solidLogin,
} from "@inrupt/solid-client-authn-browser";

export type AuthState = {
  isLoggedIn: boolean;
  webId: string | undefined;
  authFetch: typeof fetch;
  login: () => Promise<void>;
};

export function useAuth(): AuthState {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [webId, setWebId] = useState<string | undefined>();

  useEffect(() => {
    // Complete the OIDC redirect on mount — this resolves the session if the
    // browser just returned from the identity provider's login page.
    handleIncomingRedirect({ restorePreviousSession: true }).then(() => {
      const session = getDefaultSession();
      setIsLoggedIn(session.info.isLoggedIn);
      setWebId(session.info.webId);
    });
  }, []);

  async function login() {
    await solidLogin({
      oidcIssuer: process.env.NEXT_PUBLIC_OIDC_ISSUER!,
      // After login, the provider redirects back to wherever we currently are
      redirectUrl: window.location.href,
      clientName: "Solid Locations Demo",
    });
  }

  return {
    isLoggedIn,
    webId,
    // getDefaultSession().fetch is an authenticated fetch — same interface as
    // the browser's built-in fetch but with DPoP proof headers attached
    authFetch: getDefaultSession().fetch as typeof fetch,
    login,
  };
}
