// components/dashboard/Bone.tsx
import type * as React from "react";
import { cn } from "@/lib/utils";

export function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div aria-hidden="true" style={style} className={cn("animate-pulse rounded-md bg-muted", className)} />
  );
}