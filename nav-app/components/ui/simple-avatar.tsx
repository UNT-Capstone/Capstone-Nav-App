"use client";

import * as React from "react";

export function Avatar({ children, className }: any) {
  return (
    <div className={`relative inline-flex h-10 w-10 rounded-full bg-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt }: any) {
  return (
    <img src={src} alt={alt} className="h-full w-full rounded-full object-cover" />
  );
}

export function AvatarFallback({ children }: any) {
  return (
    <span className="flex h-full w-full items-center justify-center text-sm font-medium">
      {children}
    </span>
  );
}