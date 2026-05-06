"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface LoadingSpinnerProps {
  duration?: number;
}

export default function LoadingSpinner({ duration = 3000 }: LoadingSpinnerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f8f8f8] dark:bg-slate-950 backdrop-blur-sm"
      role="status"
      aria-label="Cargando página"
    >
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-primary border-r-primary rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Logo CBT Núm. 5"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="text-center">
          <h2 className="font-headline-sm text-headline-sm text-on-background mb-3">
            CBT Núm. 5 Chalco
          </h2>
          <div className="flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-primary animate-spin"
              aria-hidden="true"
            >
              <path d="M12 15.5c1.93 0 3.5-1.57 3.5-3.5s-1.57-3.5-3.5-3.5-3.5 1.57-3.5 3.5 1.57 3.5 3.5 3.5zm5.43-2.12c.08-.47.12-.95.12-1.38 0-.44-.04-.92-.12-1.38l1.73-1.35c.16-.12.19-.35.05-.54l-1.64-2.84c-.12-.22-.37-.29-.59-.22l-2.04.82c-.42-.32-.9-.59-1.42-.78l-.31-2.16c-.04-.24-.24-.41-.5-.41h-3.28c-.26 0-.46.17-.49.41l-.31 2.16c-.52.19-1 .46-1.41.78l-2.05-.82c-.22-.09-.47 0-.59.22L2.74 8.87c-.14.18-.11.42.05.54l1.73 1.35c-.08.46-.12.94-.12 1.38s.04.92.12 1.38l-1.73 1.35c-.16.12-.19.35-.05.54l1.64 2.84c.12.22.37.29.59.22l2.04-.82c.42.32.9.59 1.42.78l.31 2.16c.05.24.24.41.5.41h3.28c.26 0 .46-.17.49-.41l.31-2.16c.52-.19 1-.46 1.41-.78l2.05.82c.22.09.47 0 .59-.22l1.64-2.84c.12-.22.09-.46-.05-.54l-1.73-1.35zM12 17.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
            </svg>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Iniciando...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
