import { clsx, type ClassValue } from "clsx";
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...values: ClassValue[]) {
  return twMerge(clsx(...values));
}

export function usePrevious<T>(value: T): T {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
