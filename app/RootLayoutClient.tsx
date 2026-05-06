"use client";

import { AdminConfigProvider } from "@/app/context/AdminConfigContext";
import { ReactNode, useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { SkipLink, SKIP_LINK_ID } from "@/lib/a11y";

export default function RootLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    Sentry.setUser(null);
  }, []);

  return (
    <AdminConfigProvider>
      <SkipLink />
      <main id={SKIP_LINK_ID} tabIndex={-1}>
        {children}
      </main>
    </AdminConfigProvider>
  );
}
