"use client";

import { AdminConfigProvider } from "@/app/context/AdminConfigContext";
import { ReactNode } from "react";

export default function RootLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminConfigProvider>
      {children}
    </AdminConfigProvider>
  );
}
