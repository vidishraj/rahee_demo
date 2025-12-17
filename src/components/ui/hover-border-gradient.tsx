"use client";
import React from "react";
import { HoverBorderGradient } from "./main";

export function HoverBorderGradientDemo() {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 text-xl px-8 py-4"
      >
        <span>Glowwwy</span>
      </HoverBorderGradient>
    </div>
  );
}
