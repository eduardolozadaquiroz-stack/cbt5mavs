"use client";

import { AdminConfigProvider } from "@/app/context/AdminConfigContext";
import { ReactNode, useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

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
      {children}
    </AdminConfigProvider>
  );
}
