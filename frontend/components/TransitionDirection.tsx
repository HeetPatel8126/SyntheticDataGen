"use client";
import { useEffect } from "react";
export function TransitionDirection() {
  useEffect(() => {
    const handlePopState = () => {
      document.documentElement.classList.add("back-transition");
      setTimeout(() => {
        document.documentElement.classList.remove("back-transition");
      }, 1000);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  return null;
}
