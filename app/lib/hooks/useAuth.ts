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
    const session = getDefaultSession();

    // Read current state — AuthProvider in layout.tsx may have already
    // completed handleIncomingRedirect by the time this hook runs.
    setIsLoggedIn(session.info.isLoggedIn);
    setWebId(session.info.webId);

    // Listen for session changes so the UI updates reactively:
    //   "login"          — OIDC redirect completed successfully
    //   "sessionRestore" — silent re-login on page refresh
    //   "logout"         — user logged out
    const onLogin = () => { setIsLoggedIn(true);  setWebId(getDefaultSession().info.webId); };
    const onLogout = () => { setIsLoggedIn(false); setWebId(undefined); };

    session.events.on("login", onLogin);
    session.events.on("sessionRestore", onLogin);
    session.events.on("logout", onLogout);

    return () => {
      session.events.off("login", onLogin);
      session.events.off("sessionRestore", onLogin);
      session.events.off("logout", onLogout);
    };
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
